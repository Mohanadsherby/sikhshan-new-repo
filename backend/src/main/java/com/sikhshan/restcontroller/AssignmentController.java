package com.sikhshan.restcontroller;

import com.sikhshan.dto.AssignmentRequest;
import com.sikhshan.dto.AssignmentResponse;
import com.sikhshan.model.Assignment;
import com.sikhshan.model.AssignmentSubmission;
import com.sikhshan.model.Course;
import com.sikhshan.model.User;
import com.sikhshan.repository.AssignmentRepository;
import com.sikhshan.repository.CourseRepository;
import com.sikhshan.repository.AssignmentSubmissionRepository;
import com.sikhshan.service.CloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.Map;
import org.springframework.http.HttpStatus;
import java.util.HashMap;

@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {
    @Autowired
    private AssignmentRepository assignmentRepository;
    @Autowired
    private CourseRepository courseRepository;
    @Autowired
    private AssignmentSubmissionRepository submissionRepository;
    @Autowired
    private CloudinaryService cloudinaryService;

    private AssignmentResponse toResponse(Assignment assignment) {
        AssignmentResponse resp = new AssignmentResponse();
        resp.setId(assignment.getId());
        resp.setName(assignment.getName());
        resp.setDescription(assignment.getDescription());
        resp.setDueDate(assignment.getDueDate());
        resp.setCreatedAt(assignment.getCreatedAt());
        resp.setStatus(assignment.getStatus());
        resp.setCloudinaryUrl(assignment.getCloudinaryUrl());
        resp.setOriginalFileName(assignment.getOriginalFileName());
        
        if (assignment.getCourse() != null) {
            resp.setCourseId(assignment.getCourse().getId());
            resp.setCourseName(assignment.getCourse().getName());
        }
        
        if (assignment.getInstructor() != null) {
            resp.setInstructorId(assignment.getInstructor().getId());
            resp.setInstructorName(assignment.getInstructor().getName());
            resp.setInstructorProfilePictureUrl(assignment.getInstructor().getCloudinaryUrl());
        }
        
        // Check if assignment is overdue
        resp.setOverdue(assignment.getDueDate() != null && assignment.getDueDate().isBefore(LocalDateTime.now()));
        
        // Get submission counts
        List<AssignmentSubmission> submissions = submissionRepository.findByAssignmentId(assignment.getId());
        resp.setSubmissionCount(submissions.size());
        
        long gradedCount = submissions.stream()
            .filter(s -> s.getStatus() != null && s.getStatus().contains("GRADED"))
            .count();
        resp.setGradedCount((int) gradedCount);
        
        return resp;
    }

    // Create assignment
    @PostMapping
    public ResponseEntity<?> createAssignment(@RequestBody AssignmentRequest request) {
        try {
            Optional<Course> courseOpt = courseRepository.findById(request.getCourseId());
            if (courseOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Invalid course ID");
            }
            
            Assignment assignment = new Assignment();
            assignment.setName(request.getName());
            assignment.setDescription(request.getDescription());
            assignment.setDueDate(request.getDueDate());
            assignment.setStatus(request.getStatus() != null ? request.getStatus() : "ACTIVE");
            assignment.setCourse(courseOpt.get());
            assignment.setInstructor(courseOpt.get().getInstructor());
            
            Assignment savedAssignment = assignmentRepository.save(assignment);
            return ResponseEntity.ok(toResponse(savedAssignment));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating assignment: " + e.getMessage());
        }
    }

    // Upload assignment file
    @PostMapping("/{id}/file")
    public ResponseEntity<?> uploadAssignmentFile(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        try {
            Optional<Assignment> assignmentOpt = assignmentRepository.findById(id);
            if (assignmentOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Assignment assignment = assignmentOpt.get();
            
            // Delete old file if exists
            if (assignment.getCloudinaryPublicId() != null) {
                try {
                    cloudinaryService.deleteFile(assignment.getCloudinaryPublicId());
                } catch (Exception e) {
                    // Log error but continue
                    System.err.println("Error deleting old file: " + e.getMessage());
                }
            }
            
            // Upload new file
            Map<String, Object> uploadResult = cloudinaryService.uploadAssignmentFile(file, id);
            
            assignment.setCloudinaryPublicId((String) uploadResult.get("public_id"));
            assignment.setCloudinaryUrl((String) uploadResult.get("secure_url"));
            assignment.setOriginalFileName(file.getOriginalFilename());
            
            Assignment savedAssignment = assignmentRepository.save(assignment);
            return ResponseEntity.ok(toResponse(savedAssignment));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error uploading file: " + e.getMessage());
        }
    }

    // List all assignments
    @GetMapping
    public ResponseEntity<List<AssignmentResponse>> getAllAssignments() {
        List<Assignment> assignments = assignmentRepository.findAll();
        List<AssignmentResponse> responses = assignments.stream().map(this::toResponse).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // Get assignment by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getAssignmentById(@PathVariable Long id) {
        Optional<Assignment> assignmentOpt = assignmentRepository.findById(id);
        if (assignmentOpt.isPresent()) {
            return ResponseEntity.ok(toResponse(assignmentOpt.get()));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Get assignments by course ID
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<AssignmentResponse>> getAssignmentsByCourse(@PathVariable Long courseId) {
        try {
            System.out.println("Fetching assignments for course ID: " + courseId);
            List<Assignment> assignments = assignmentRepository.findByCourseId(courseId);
            System.out.println("Found " + assignments.size() + " assignments for course " + courseId);
            
            List<AssignmentResponse> responses = assignments.stream()
                    .map(this::toResponse)
                    .collect(Collectors.toList());
            
            System.out.println("Converted to " + responses.size() + " responses");
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            System.err.println("Error fetching assignments for course " + courseId + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // List active assignments for a course
    @GetMapping("/course/{courseId}/active")
    public ResponseEntity<List<AssignmentResponse>> getActiveAssignmentsByCourse(@PathVariable Long courseId) {
        List<Assignment> assignments = assignmentRepository.findByCourseIdAndStatus(courseId, "ACTIVE");
        List<AssignmentResponse> responses = assignments.stream().map(this::toResponse).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // List overdue assignments for a course
    @GetMapping("/course/{courseId}/overdue")
    public ResponseEntity<List<AssignmentResponse>> getOverdueAssignmentsByCourse(@PathVariable Long courseId) {
        List<Assignment> assignments = assignmentRepository.findOverdueAssignmentsByCourse(courseId, LocalDateTime.now());
        List<AssignmentResponse> responses = assignments.stream().map(this::toResponse).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // List assignments by instructor
    @GetMapping("/instructor/{instructorId}")
    public ResponseEntity<List<AssignmentResponse>> getAssignmentsByInstructor(@PathVariable Long instructorId) {
        List<Assignment> assignments = assignmentRepository.findByInstructorId(instructorId);
        List<AssignmentResponse> responses = assignments.stream().map(this::toResponse).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // Update assignment
    @PutMapping("/{id}")
    public ResponseEntity<?> updateAssignment(@PathVariable Long id, @RequestBody AssignmentRequest request) {
        try {
            Optional<Assignment> assignmentOpt = assignmentRepository.findById(id);
            if (assignmentOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Assignment assignment = assignmentOpt.get();
            assignment.setName(request.getName());
            assignment.setDescription(request.getDescription());
            assignment.setDueDate(request.getDueDate());
            if (request.getStatus() != null) {
                assignment.setStatus(request.getStatus());
            }
            
            Assignment savedAssignment = assignmentRepository.save(assignment);
            return ResponseEntity.ok(toResponse(savedAssignment));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating assignment: " + e.getMessage());
        }
    }

    // Delete assignment
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAssignment(@PathVariable Long id) {
        try {
            Optional<Assignment> assignmentOpt = assignmentRepository.findById(id);
            if (assignmentOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Assignment assignment = assignmentOpt.get();
            
            // Delete file from Cloudinary if exists
            if (assignment.getCloudinaryPublicId() != null) {
                try {
                    cloudinaryService.deleteFile(assignment.getCloudinaryPublicId());
                } catch (Exception e) {
                    // Log error but continue
                    System.err.println("Error deleting file from Cloudinary: " + e.getMessage());
                }
            }
            
            // Delete all submissions for this assignment
            List<AssignmentSubmission> submissions = submissionRepository.findByAssignmentId(id);
            for (AssignmentSubmission submission : submissions) {
                if (submission.getCloudinaryPublicId() != null) {
                    try {
                        cloudinaryService.deleteFile(submission.getCloudinaryPublicId());
                    } catch (Exception e) {
                        // Log error but continue
                        System.err.println("Error deleting submission file from Cloudinary: " + e.getMessage());
                    }
                }
                submissionRepository.delete(submission);
            }
            
            assignmentRepository.delete(assignment);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting assignment: " + e.getMessage());
        }
    }

    // Debug endpoint to test assignment fetching
    @GetMapping("/debug/course/{courseId}")
    public ResponseEntity<Map<String, Object>> debugAssignmentsByCourse(@PathVariable Long courseId) {
        Map<String, Object> response = new HashMap<>();
        try {
            System.out.println("Debug: Fetching assignments for course ID: " + courseId);
            
            // Test if course exists
            Optional<Course> course = courseRepository.findById(courseId);
            if (!course.isPresent()) {
                response.put("error", "Course not found");
                return ResponseEntity.badRequest().body(response);
            }
            response.put("course", course.get().getName());
            
            // Test assignment fetching
            List<Assignment> assignments = assignmentRepository.findByCourseId(courseId);
            response.put("assignmentCount", assignments.size());
            response.put("assignments", assignments.stream()
                    .map(a -> {
                        Map<String, Object> assignmentMap = new HashMap<>();
                        assignmentMap.put("id", a.getId());
                        assignmentMap.put("name", a.getName());
                        assignmentMap.put("status", a.getStatus());
                        return assignmentMap;
                    })
                    .collect(Collectors.toList()));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            response.put("stackTrace", e.getStackTrace());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Simple test endpoint to check assignments
    @GetMapping("/test")
    public ResponseEntity<Map<String, Object>> testAssignments() {
        Map<String, Object> response = new HashMap<>();
        try {
            // Get all assignments
            List<Assignment> allAssignments = assignmentRepository.findAll();
            response.put("totalAssignments", allAssignments.size());
            
            // Get assignments by course
            List<Assignment> courseAssignments = assignmentRepository.findByCourseId(2L);
            response.put("course2Assignments", courseAssignments.size());
            
            // Check if any assignments exist
            if (!allAssignments.isEmpty()) {
                Assignment first = allAssignments.get(0);
                Map<String, Object> sampleAssignment = new HashMap<>();
                sampleAssignment.put("id", first.getId());
                sampleAssignment.put("name", first.getName());
                sampleAssignment.put("courseId", first.getCourse() != null ? first.getCourse().getId() : "null");
                response.put("sampleAssignment", sampleAssignment);
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Very simple test endpoint
    @GetMapping("/ping")
    public ResponseEntity<String> ping() {
        return ResponseEntity.ok("Assignment controller is working!");
    }

    // Test repository access
    @GetMapping("/repo-test")
    public ResponseEntity<Map<String, Object>> testRepository() {
        Map<String, Object> response = new HashMap<>();
        try {
            // Just try to count assignments
            long count = assignmentRepository.count();
            response.put("totalAssignments", count);
            response.put("status", "Repository is working");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            response.put("status", "Repository error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
} 