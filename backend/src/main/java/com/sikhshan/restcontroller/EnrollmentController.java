package com.sikhshan.restcontroller;

import com.sikhshan.dto.EnrollmentRequest;
import com.sikhshan.dto.EnrollmentResponse;
import com.sikhshan.model.Enrollment;
import com.sikhshan.model.Course;
import com.sikhshan.model.User;
import com.sikhshan.repository.EnrollmentRepository;
import com.sikhshan.repository.CourseRepository;
import com.sikhshan.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {
    @Autowired
    private EnrollmentRepository enrollmentRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CourseRepository courseRepository;

    private EnrollmentResponse toResponse(Enrollment enrollment) {
        EnrollmentResponse resp = new EnrollmentResponse();
        resp.setId(enrollment.getId());
        if (enrollment.getStudent() != null) {
            resp.setStudentId(enrollment.getStudent().getId());
            resp.setStudentName(enrollment.getStudent().getName());
        }
        if (enrollment.getCourse() != null) {
            resp.setCourseId(enrollment.getCourse().getId());
            resp.setCourseName(enrollment.getCourse().getName());
        }
        resp.setProgress(enrollment.getProgress());
        resp.setGrade(enrollment.getGrade());
        return resp;
    }

    // Enroll a student in a course
    @PostMapping
    public ResponseEntity<?> enrollStudent(@RequestBody EnrollmentRequest request) {
        Optional<User> studentOpt = userRepository.findById(request.getStudentId());
        Optional<Course> courseOpt = courseRepository.findById(request.getCourseId());
        if (studentOpt.isEmpty() || courseOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid student or course ID");
        }
        // Prevent duplicate enrollment
        if (enrollmentRepository.findByStudentIdAndCourseId(request.getStudentId(), request.getCourseId()) != null) {
            return ResponseEntity.badRequest().body("Student already enrolled in this course");
        }
        Enrollment enrollment = new Enrollment();
        enrollment.setStudent(studentOpt.get());
        enrollment.setCourse(courseOpt.get());
        enrollment.setProgress(request.getProgress() != null ? request.getProgress() : 0);
        enrollment.setGrade(request.getGrade());
        enrollmentRepository.save(enrollment);
        return ResponseEntity.ok(toResponse(enrollment));
    }

    // List courses for a student
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<EnrollmentResponse>> getCoursesForStudent(@PathVariable Long studentId) {
        List<Enrollment> enrollments = enrollmentRepository.findByStudentId(studentId);
        List<EnrollmentResponse> responses = enrollments.stream().map(this::toResponse).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // List students in a course
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<EnrollmentResponse>> getStudentsInCourse(@PathVariable Long courseId) {
        List<Enrollment> enrollments = enrollmentRepository.findByCourseId(courseId);
        List<EnrollmentResponse> responses = enrollments.stream().map(this::toResponse).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // Update progress/grade
    @PutMapping("/{id}")
    public ResponseEntity<?> updateEnrollment(@PathVariable Long id, @RequestBody EnrollmentRequest request) {
        Optional<Enrollment> enrollmentOpt = enrollmentRepository.findById(id);
        if (enrollmentOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Enrollment not found");
        }
        Enrollment enrollment = enrollmentOpt.get();
        if (request.getProgress() != null) enrollment.setProgress(request.getProgress());
        if (request.getGrade() != null) enrollment.setGrade(request.getGrade());
        enrollmentRepository.save(enrollment);
        return ResponseEntity.ok(toResponse(enrollment));
    }

    // Unenroll a student from a course
    @DeleteMapping("/{id}")
    public ResponseEntity<?> unenrollStudent(@PathVariable Long id) {
        if (!enrollmentRepository.existsById(id)) {
            return ResponseEntity.status(404).body("Enrollment not found");
        }
        enrollmentRepository.deleteById(id);
        return ResponseEntity.ok("Unenrolled successfully");
    }
} 