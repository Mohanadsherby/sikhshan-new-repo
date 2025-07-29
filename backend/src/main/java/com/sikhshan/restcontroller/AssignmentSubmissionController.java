package com.sikhshan.restcontroller;

import com.sikhshan.dto.AssignmentSubmissionRequest;
import com.sikhshan.dto.AssignmentSubmissionResponse;
import com.sikhshan.model.Assignment;
import com.sikhshan.model.AssignmentSubmission;
import com.sikhshan.model.User;
import com.sikhshan.repository.AssignmentRepository;
import com.sikhshan.repository.AssignmentSubmissionRepository;
import com.sikhshan.repository.UserRepository;
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
import java.util.HashMap;

@RestController
@RequestMapping("/api/assignment-submissions")
public class AssignmentSubmissionController {
    @Autowired
    private AssignmentSubmissionRepository submissionRepository;
    @Autowired
    private AssignmentRepository assignmentRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CloudinaryService cloudinaryService;

    private AssignmentSubmissionResponse toResponse(AssignmentSubmission submission) {
        AssignmentSubmissionResponse resp = new AssignmentSubmissionResponse();
        resp.setId(submission.getId());
        resp.setSubmittedAt(submission.getSubmittedAt());
        resp.setLastModifiedAt(submission.getLastModifiedAt());
        resp.setStatus(submission.getStatus());
        resp.setCloudinaryUrl(submission.getCloudinaryUrl());
        resp.setOriginalFileName(submission.getOriginalFileName());
        resp.setGrade(submission.getGrade());
        resp.setPointsEarned(submission.getPointsEarned());
        resp.setLetterGrade(submission.getLetterGrade());
        resp.setGradePoint(submission.getGradePoint());
        resp.setPerformanceDescription(submission.getPerformanceDescription());
        resp.setFeedback(submission.getFeedback());
        resp.setGradedAt(submission.getGradedAt());
        resp.setSubmissionNumber(submission.getSubmissionNumber());
        resp.setIsLate(submission.getIsLate());
        
        if (submission.getAssignment() != null) {
            resp.setAssignmentId(submission.getAssignment().getId());
            resp.setAssignmentName(submission.getAssignment().getName());
            if (submission.getAssignment().getCourse() != null) {
                resp.setCourseId(submission.getAssignment().getCourse().getId());
                resp.setCourseName(submission.getAssignment().getCourse().getName());
            }
        }
        
        if (submission.getStudent() != null) {
            resp.setStudentId(submission.getStudent().getId());
            resp.setStudentName(submission.getStudent().getName());
            resp.setStudentProfilePictureUrl(submission.getStudent().getCloudinaryUrl());
        }
        
        return resp;
    }

    // Submit assignment
    @PostMapping
    public ResponseEntity<?> submitAssignment(@RequestBody AssignmentSubmissionRequest request) {
        try {
            Optional<Assignment> assignmentOpt = assignmentRepository.findById(request.getAssignmentId());
            Optional<User> studentOpt = userRepository.findById(request.getStudentId());
            
            if (assignmentOpt.isEmpty() || studentOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Invalid assignment or student ID");
            }
            
            Assignment assignment = assignmentOpt.get();
            User student = studentOpt.get();
            
            // Get latest submission number for this student and assignment
            Optional<AssignmentSubmission> latestSubmission = submissionRepository
                .findTopByAssignmentIdAndStudentIdOrderBySubmissionNumberDesc(request.getAssignmentId(), request.getStudentId());
            
            int submissionNumber = latestSubmission.map(s -> s.getSubmissionNumber() + 1).orElse(1);
            
            AssignmentSubmission submission = new AssignmentSubmission();
            submission.setAssignment(assignment);
            submission.setStudent(student);
            submission.setSubmissionNumber(submissionNumber);
            submission.setFeedback(request.getFeedback());
            
            AssignmentSubmission savedSubmission = submissionRepository.save(submission);
            return ResponseEntity.ok(toResponse(savedSubmission));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error submitting assignment: " + e.getMessage());
        }
    }

    // Upload submission file
    @PostMapping("/{id}/file")
    public ResponseEntity<?> uploadSubmissionFile(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        try {
            Optional<AssignmentSubmission> submissionOpt = submissionRepository.findById(id);
            if (submissionOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            AssignmentSubmission submission = submissionOpt.get();
            
            // Delete old file if exists
            if (submission.getCloudinaryPublicId() != null) {
                try {
                    cloudinaryService.deleteFile(submission.getCloudinaryPublicId());
                } catch (Exception e) {
                    // Log error but continue
                    System.err.println("Error deleting old file: " + e.getMessage());
                }
            }
            
            // Upload new file
            Map<String, Object> uploadResult = cloudinaryService.uploadSubmissionFile(
                file, 
                submission.getAssignment().getId(), 
                submission.getStudent().getId(), 
                submission.getSubmissionNumber()
            );
            
            submission.setCloudinaryPublicId((String) uploadResult.get("public_id"));
            submission.setCloudinaryUrl((String) uploadResult.get("secure_url"));
            submission.setOriginalFileName(file.getOriginalFilename());
            
            AssignmentSubmission savedSubmission = submissionRepository.save(submission);
            return ResponseEntity.ok(toResponse(savedSubmission));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error uploading file: " + e.getMessage());
        }
    }

    // Grade submission
    @PutMapping("/{id}/grade")
    public ResponseEntity<?> gradeSubmission(@PathVariable Long id, @RequestBody Map<String, Object> gradeRequest) {
        try {
            Optional<AssignmentSubmission> submissionOpt = submissionRepository.findById(id);
            if (submissionOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            AssignmentSubmission submission = submissionOpt.get();
            
            // Get points earned from request
            Integer pointsEarned = null;
            if (gradeRequest.get("pointsEarned") != null) {
                if (gradeRequest.get("pointsEarned") instanceof Number) {
                    pointsEarned = ((Number) gradeRequest.get("pointsEarned")).intValue();
                } else {
                    pointsEarned = Integer.parseInt(gradeRequest.get("pointsEarned").toString());
                }
            }
            
            // Validate points earned
            if (pointsEarned == null || pointsEarned < 0) {
                return ResponseEntity.badRequest().body("Points earned must be a non-negative number");
            }
            
            // Get assignment to check total points
            Assignment assignment = submission.getAssignment();
            if (assignment == null) {
                return ResponseEntity.badRequest().body("Assignment not found");
            }
            
            Integer totalPoints = assignment.getTotalPoints();
            if (totalPoints == null || totalPoints <= 0) {
                return ResponseEntity.badRequest().body("Assignment total points not set");
            }
            
            // Validate points earned doesn't exceed total points
            if (pointsEarned > totalPoints) {
                return ResponseEntity.badRequest().body("Points earned cannot exceed total points (" + totalPoints + ")");
            }
            
            // Calculate percentage and letter grade
            double percentage = com.sikhshan.utility.GradeCalculator.calculatePercentage(pointsEarned, totalPoints);
            String letterGrade = com.sikhshan.utility.GradeCalculator.calculateLetterGrade(percentage);
            double gradePoint = com.sikhshan.utility.GradeCalculator.calculateGradePoint(percentage);
            String performanceDescription = com.sikhshan.utility.GradeCalculator.getPerformanceDescription(percentage);
            
            String feedback = (String) gradeRequest.get("feedback");
            
            // Set all grading fields
            submission.setPointsEarned(pointsEarned);
            submission.setGrade(percentage);
            submission.setLetterGrade(letterGrade);
            submission.setGradePoint(gradePoint);
            submission.setPerformanceDescription(performanceDescription);
            submission.setFeedback(feedback);
            submission.setGradedAt(LocalDateTime.now());
            
            // Update status based on whether it was late
            if (submission.getIsLate()) {
                submission.setStatus("LATE_GRADED");
            } else {
                submission.setStatus("GRADED");
            }
            
            AssignmentSubmission savedSubmission = submissionRepository.save(submission);
            return ResponseEntity.ok(toResponse(savedSubmission));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error grading submission: " + e.getMessage());
        }
    }

    // Get submission by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getSubmissionById(@PathVariable Long id) {
        Optional<AssignmentSubmission> submissionOpt = submissionRepository.findById(id);
        if (submissionOpt.isPresent()) {
            return ResponseEntity.ok(toResponse(submissionOpt.get()));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Get all submissions for an assignment
    @GetMapping("/assignment/{assignmentId}")
    public ResponseEntity<List<AssignmentSubmissionResponse>> getSubmissionsByAssignment(@PathVariable Long assignmentId) {
        List<AssignmentSubmission> submissions = submissionRepository.findByAssignmentIdOrderBySubmittedAtDesc(assignmentId);
        List<AssignmentSubmissionResponse> responses = submissions.stream().map(this::toResponse).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // Get all submissions for a student
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<AssignmentSubmissionResponse>> getSubmissionsByStudent(@PathVariable Long studentId) {
        List<AssignmentSubmission> submissions = submissionRepository.findByStudentId(studentId);
        List<AssignmentSubmissionResponse> responses = submissions.stream().map(this::toResponse).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // Get student's submissions for a course
    @GetMapping("/student/{studentId}/course/{courseId}")
    public ResponseEntity<List<AssignmentSubmissionResponse>> getStudentSubmissionsByCourse(@PathVariable Long studentId, @PathVariable Long courseId) {
        List<AssignmentSubmission> submissions = submissionRepository.findByStudentIdAndCourseId(studentId, courseId);
        List<AssignmentSubmissionResponse> responses = submissions.stream().map(this::toResponse).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // Get latest submission for a student and assignment
    @GetMapping("/assignment/{assignmentId}/student/{studentId}/latest")
    public ResponseEntity<?> getLatestSubmission(@PathVariable Long assignmentId, @PathVariable Long studentId) {
        Optional<AssignmentSubmission> submissionOpt = submissionRepository
            .findTopByAssignmentIdAndStudentIdOrderBySubmissionNumberDesc(assignmentId, studentId);
        
        if (submissionOpt.isPresent()) {
            return ResponseEntity.ok(toResponse(submissionOpt.get()));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Get graded submissions for an assignment
    @GetMapping("/assignment/{assignmentId}/graded")
    public ResponseEntity<List<AssignmentSubmissionResponse>> getGradedSubmissions(@PathVariable Long assignmentId) {
        List<AssignmentSubmission> submissions = submissionRepository.findGradedSubmissionsByAssignment(assignmentId);
        List<AssignmentSubmissionResponse> responses = submissions.stream().map(this::toResponse).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // Get late submissions for an assignment
    @GetMapping("/assignment/{assignmentId}/late")
    public ResponseEntity<List<AssignmentSubmissionResponse>> getLateSubmissions(@PathVariable Long assignmentId) {
        List<AssignmentSubmission> submissions = submissionRepository.findLateSubmissionsByAssignment(assignmentId);
        List<AssignmentSubmissionResponse> responses = submissions.stream().map(this::toResponse).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // Delete submission (for resubmission)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSubmission(@PathVariable Long id) {
        try {
            Optional<AssignmentSubmission> submissionOpt = submissionRepository.findById(id);
            if (submissionOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            AssignmentSubmission submission = submissionOpt.get();
            
            // Delete file from Cloudinary if exists
            if (submission.getCloudinaryPublicId() != null) {
                try {
                    cloudinaryService.deleteFile(submission.getCloudinaryPublicId());
                } catch (Exception e) {
                    // Log error but continue
                    System.err.println("Error deleting file from Cloudinary: " + e.getMessage());
                }
            }
            
            submissionRepository.delete(submission);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting submission: " + e.getMessage());
        }
    }

    // Debug endpoint to test grading
    @GetMapping("/debug/test-grading/{submissionId}")
    public ResponseEntity<Map<String, Object>> testGrading(@PathVariable Long submissionId) {
        try {
            Optional<AssignmentSubmission> submissionOpt = submissionRepository.findById(submissionId);
            if (submissionOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            AssignmentSubmission submission = submissionOpt.get();
            Map<String, Object> result = new HashMap<>();
            result.put("submissionId", submissionId);
            result.put("pointsEarned", submission.getPointsEarned());
            result.put("grade", submission.getGrade());
            result.put("letterGrade", submission.getLetterGrade());
            result.put("gradePoint", submission.getGradePoint());
            result.put("performanceDescription", submission.getPerformanceDescription());
            result.put("status", submission.getStatus());
            
            if (submission.getAssignment() != null) {
                result.put("assignmentTotalPoints", submission.getAssignment().getTotalPoints());
            }
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
} 