package com.sikhshan.restcontroller;

import com.sikhshan.dto.CourseGradeResponse;
import com.sikhshan.model.CourseGrade;
import com.sikhshan.service.GradingService;
import com.sikhshan.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/grades")
@CrossOrigin(origins = "*")
public class GradingController {

    @Autowired
    private GradingService gradingService;

    @Autowired
    private JwtService jwtService;

    /**
     * Calculate and get course grade for a student
     */
    @GetMapping("/course/{courseId}/student/{studentId}")
    public ResponseEntity<?> getCourseGrade(@PathVariable Long courseId, @PathVariable Long studentId, 
                                           @RequestHeader("Authorization") String token) {
        try {
            System.out.println("Received request for courseId: " + courseId + ", studentId: " + studentId);
            
            // Extract user ID from JWT token
            Long userId = jwtService.extractUserId(token.substring(7));
            System.out.println("Extracted userId from token: " + userId);
            
            // Calculate or get existing grade
            CourseGrade courseGrade = gradingService.calculateCourseGrade(studentId, courseId);
            CourseGradeResponse response = toCourseGradeResponse(courseGrade);
            
            System.out.println("Successfully calculated grade for student: " + studentId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error in getCourseGrade: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Get all grades for a student
     */
    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getStudentGrades(@PathVariable Long studentId, 
                                             @RequestHeader("Authorization") String token) {
        try {
            // Extract user ID from JWT token
            Long userId = jwtService.extractUserId(token.substring(7));
            
            List<CourseGrade> grades = gradingService.getStudentGrades(studentId);
            List<CourseGradeResponse> responses = grades.stream()
                    .map(this::toCourseGradeResponse)
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Get all grades for a course (for faculty)
     */
    @GetMapping("/course/{courseId}")
    public ResponseEntity<?> getCourseGrades(@PathVariable Long courseId, 
                                            @RequestHeader("Authorization") String token) {
        try {
            // Extract user ID from JWT token
            Long userId = jwtService.extractUserId(token.substring(7));
            
            List<CourseGrade> grades = gradingService.getCourseGrades(courseId);
            List<CourseGradeResponse> responses = grades.stream()
                    .map(this::toCourseGradeResponse)
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Update grading weights for a course
     */
    @PutMapping("/course/{courseId}/weights")
    public ResponseEntity<?> updateGradingWeights(@PathVariable Long courseId, 
                                                 @RequestParam Long studentId,
                                                 @RequestParam Double assignmentWeight,
                                                 @RequestParam Double quizWeight,
                                                 @RequestHeader("Authorization") String token) {
        try {
            // Extract user ID from JWT token
            Long userId = jwtService.extractUserId(token.substring(7));
            
            CourseGrade courseGrade = gradingService.updateGradingWeights(studentId, courseId, assignmentWeight, quizWeight);
            CourseGradeResponse response = toCourseGradeResponse(courseGrade);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Calculate overall GPA for a student
     */
    @GetMapping("/student/{studentId}/gpa")
    public ResponseEntity<?> getStudentGPA(@PathVariable Long studentId, 
                                          @RequestHeader("Authorization") String token) {
        try {
            // Extract user ID from JWT token
            Long userId = jwtService.extractUserId(token.substring(7));
            
            double gpa = gradingService.calculateOverallGPA(studentId);
            
            return ResponseEntity.ok(new GPAResponse(studentId, gpa));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Test endpoint to check if grading system is working
     */
    @GetMapping("/test")
    public ResponseEntity<?> testGradingSystem() {
        try {
            return ResponseEntity.ok("Grading system is working");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Recalculate all grades for a course (when assignments/quizzes are updated)
     */
    @PostMapping("/course/{courseId}/recalculate")
    public ResponseEntity<?> recalculateCourseGrades(@PathVariable Long courseId, 
                                                    @RequestHeader("Authorization") String token) {
        try {
            // Extract user ID from JWT token
            Long userId = jwtService.extractUserId(token.substring(7));
            
            gradingService.recalculateCourseGrades(courseId);
            
            return ResponseEntity.ok("Grades recalculated successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Convert CourseGrade to CourseGradeResponse
     */
    private CourseGradeResponse toCourseGradeResponse(CourseGrade courseGrade) {
        CourseGradeResponse response = new CourseGradeResponse();
        response.setId(courseGrade.getId());
        response.setStudentId(courseGrade.getStudent().getId());
        response.setStudentName(courseGrade.getStudent().getName());
        response.setStudentEmail(courseGrade.getStudent().getEmail());
        response.setCourseId(courseGrade.getCourse().getId());
        response.setCourseName(courseGrade.getCourse().getName());
        response.setCourseCode(courseGrade.getCourse().getCode());
        
        // Assignment grades
        response.setAssignmentTotalPoints(courseGrade.getAssignmentTotalPoints());
        response.setAssignmentPointsEarned(courseGrade.getAssignmentPointsEarned());
        response.setAssignmentPercentage(courseGrade.getAssignmentPercentage());
        response.setAssignmentCount(courseGrade.getAssignmentCount());
        response.setAssignmentGradedCount(courseGrade.getAssignmentGradedCount());
        
        // Quiz grades
        response.setQuizTotalPoints(courseGrade.getQuizTotalPoints());
        response.setQuizPointsEarned(courseGrade.getQuizPointsEarned());
        response.setQuizPercentage(courseGrade.getQuizPercentage());
        response.setQuizCount(courseGrade.getQuizCount());
        response.setQuizAttemptedCount(courseGrade.getQuizAttemptedCount());
        
        // Overall course grade
        response.setTotalPoints(courseGrade.getTotalPoints());
        response.setPointsEarned(courseGrade.getPointsEarned());
        response.setFinalPercentage(courseGrade.getFinalPercentage());
        response.setLetterGrade(courseGrade.getLetterGrade());
        response.setGradePoint(courseGrade.getGradePoint());
        response.setPerformanceDescription(courseGrade.getPerformanceDescription());
        
        // Grading weights
        response.setAssignmentWeight(courseGrade.getAssignmentWeight());
        response.setQuizWeight(courseGrade.getQuizWeight());
        
        // Timestamps
        response.setLastUpdated(courseGrade.getLastUpdated());
        response.setCreatedAt(courseGrade.getCreatedAt());
        response.setStatus(courseGrade.getStatus());
        
        return response;
    }

    /**
     * Inner class for GPA response
     */
    public static class GPAResponse {
        private Long studentId;
        private double gpa;

        public GPAResponse(Long studentId, double gpa) {
            this.studentId = studentId;
            this.gpa = gpa;
        }

        public Long getStudentId() { return studentId; }
        public void setStudentId(Long studentId) { this.studentId = studentId; }

        public double getGpa() { return gpa; }
        public void setGpa(double gpa) { this.gpa = gpa; }
    }
} 