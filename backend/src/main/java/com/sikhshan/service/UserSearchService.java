package com.sikhshan.service;

import com.sikhshan.dto.UserSearchRequest;
import com.sikhshan.dto.UserSearchResponse;
import com.sikhshan.model.Enrollment;
import com.sikhshan.model.User;
import com.sikhshan.model.UserStatus;
import com.sikhshan.repository.EnrollmentRepository;
import com.sikhshan.repository.UserRepository;
import com.sikhshan.repository.UserStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserSearchService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private UserStatusRepository userStatusRepository;
    
    @Autowired
    private EnrollmentRepository enrollmentRepository;
    
    public UserSearchResponse searchUsers(UserSearchRequest request) {
        UserSearchResponse response = new UserSearchResponse();
        
        // Create pageable for pagination
        Pageable pageable = PageRequest.of(request.getPage(), request.getSize());
        
        // Search users based on query and role
        Page<User> userPage = searchUsersByQueryAndRole(request.getQuery(), request.getRole(), pageable);
        
        // Convert to UserInfo and exclude current user and admin users
        List<UserSearchResponse.UserInfo> users = userPage.getContent().stream()
                .filter(user -> user.getId() != request.getCurrentUserId())
                .filter(user -> !"ADMIN".equals(user.getRole().name())) // Exclude admin users
                .map(this::toUserInfo)
                .collect(Collectors.toList());
        
        // Get suggested users (course instructors for students, students for faculty)
        List<UserSearchResponse.UserInfo> suggestedUsers = getSuggestedUsers(request.getCurrentUserId());
        
        // Set response data
        response.setUsers(users);
        response.setSuggestedUsers(suggestedUsers);
        response.setTotalElements((int) userPage.getTotalElements());
        response.setTotalPages(userPage.getTotalPages());
        response.setCurrentPage(request.getPage());
        response.setSize(request.getSize());
        
        return response;
    }
    
    private Page<User> searchUsersByQueryAndRole(String query, String role, Pageable pageable) {
        if (query != null && !query.trim().isEmpty()) {
            if (role != null && !role.trim().isEmpty()) {
                // Search by query and role
                return userRepository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCaseAndRole(
                        query.trim(), query.trim(), role, pageable);
            } else {
                // Search by query only
                return userRepository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
                        query.trim(), query.trim(), pageable);
            }
        } else {
            if (role != null && !role.trim().isEmpty()) {
                // Search by role only
                return userRepository.findByRole(role, pageable);
            } else {
                // Return all users
                return userRepository.findAll(pageable);
            }
        }
    }
    
    private List<UserSearchResponse.UserInfo> getSuggestedUsers(Long currentUserId) {
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new RuntimeException("Current user not found"));
        
        if ("STUDENT".equals(currentUser.getRole().name())) {
            // For students, suggest course instructors
            return getCourseInstructorsForStudent(currentUserId);
        } else if ("FACULTY".equals(currentUser.getRole().name())) {
            // For faculty, suggest students in their courses
            return getStudentsForFaculty(currentUserId);
        }
        
        return List.of();
    }
    
    private List<UserSearchResponse.UserInfo> getCourseInstructorsForStudent(Long studentId) {
        // Get all courses the student is enrolled in
        List<Enrollment> enrollments = enrollmentRepository.findByStudentId(studentId);
        Set<Long> courseIds = enrollments.stream()
                .map(enrollment -> enrollment.getCourse().getId())
                .collect(Collectors.toSet());
        
        // Get unique instructors from these courses
        Set<User> instructors = enrollments.stream()
                .map(enrollment -> enrollment.getCourse().getInstructor())
                .collect(Collectors.toSet());
        
        return instructors.stream()
                .filter(instructor -> !"ADMIN".equals(instructor.getRole().name())) // Exclude admin users
                .map(this::toUserInfo)
                .collect(Collectors.toList());
    }
    
    private List<UserSearchResponse.UserInfo> getStudentsForFaculty(Long facultyId) {
        // Get all students enrolled in courses taught by this faculty
        List<Enrollment> enrollments = enrollmentRepository.findByCourseInstructorId(facultyId);
        Set<User> students = enrollments.stream()
                .map(Enrollment::getStudent)
                .collect(Collectors.toSet());
        
        return students.stream()
                .filter(student -> !"ADMIN".equals(student.getRole().name())) // Exclude admin users
                .map(this::toUserInfo)
                .collect(Collectors.toList());
    }
    
    private UserSearchResponse.UserInfo toUserInfo(User user) {
        // Temporary fix: Skip user status lookup until database is updated
        Boolean isOnline = false; // Default to offline
        String lastSeen = null;
        
        UserSearchResponse.UserInfo userInfo = new UserSearchResponse.UserInfo(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getProfilePictureUrl(),
                user.getRole().name(),
                isOnline
        );
        
        userInfo.setLastSeen(lastSeen);
        return userInfo;
    }
} 