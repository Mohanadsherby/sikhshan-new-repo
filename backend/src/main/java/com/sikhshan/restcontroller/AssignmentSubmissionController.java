package com.sikhshan.restcontroller;

import com.sikhshan.dto.AssignmentSubmissionRequest;
import com.sikhshan.dto.AssignmentSubmissionResponse;
import com.sikhshan.model.Assignment;
import com.sikhshan.model.AssignmentSubmission;
import com.sikhshan.model.User;
import com.sikhshan.repository.AssignmentRepository;
import com.sikhshan.repository.AssignmentSubmissionRepository;
import com.sikhshan.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/assignment-submissions")
public class AssignmentSubmissionController {
    @Autowired
    private AssignmentSubmissionRepository submissionRepository;
    @Autowired
    private AssignmentRepository assignmentRepository;
    @Autowired
    private UserRepository userRepository;

    private AssignmentSubmissionResponse toResponse(AssignmentSubmission submission) {
        AssignmentSubmissionResponse resp = new AssignmentSubmissionResponse();
        resp.setId(submission.getId());
        if (submission.getAssignment() != null) {
            resp.setAssignmentId(submission.getAssignment().getId());
            resp.setAssignmentName(submission.getAssignment().getName());
        }
        if (submission.getStudent() != null) {
            resp.setStudentId(submission.getStudent().getId());
            resp.setStudentName(submission.getStudent().getName());
        }
        resp.setSubmittedAt(submission.getSubmittedAt());
        resp.setFileUrl(submission.getFileUrl());
        resp.setGrade(submission.getGrade());
        resp.setFeedback(submission.getFeedback());
        return resp;
    }

    // Submit assignment (with file upload)
    @PostMapping
    public ResponseEntity<?> submitAssignment(@RequestParam Long assignmentId, @RequestParam Long studentId, @RequestParam("file") MultipartFile file) {
        Optional<Assignment> assignmentOpt = assignmentRepository.findById(assignmentId);
        Optional<User> studentOpt = userRepository.findById(studentId);
        if (assignmentOpt.isEmpty() || studentOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid assignment or student ID");
        }
        // Save file
        String uploadDir = "uploads/assignment-submissions/";
        File dir = new File(uploadDir);
        if (!dir.exists()) dir.mkdirs();
        String filename = "assignment_" + assignmentId + "_student_" + studentId + "_" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filepath = Paths.get(uploadDir, filename);
        try {
            Files.write(filepath, file.getBytes());
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Failed to upload file");
        }
        AssignmentSubmission submission = new AssignmentSubmission();
        submission.setAssignment(assignmentOpt.get());
        submission.setStudent(studentOpt.get());
        submission.setSubmittedAt(LocalDateTime.now());
        submission.setFileUrl("/" + uploadDir + filename);
        submissionRepository.save(submission);
        return ResponseEntity.ok(toResponse(submission));
    }

    // List submissions for an assignment
    @GetMapping("/assignment/{assignmentId}")
    public ResponseEntity<List<AssignmentSubmissionResponse>> getSubmissionsByAssignment(@PathVariable Long assignmentId) {
        List<AssignmentSubmission> submissions = submissionRepository.findByAssignmentId(assignmentId);
        List<AssignmentSubmissionResponse> responses = submissions.stream().map(this::toResponse).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // List submissions by a student
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<AssignmentSubmissionResponse>> getSubmissionsByStudent(@PathVariable Long studentId) {
        List<AssignmentSubmission> submissions = submissionRepository.findByStudentId(studentId);
        List<AssignmentSubmissionResponse> responses = submissions.stream().map(this::toResponse).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // Get submission by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getSubmissionById(@PathVariable Long id) {
        Optional<AssignmentSubmission> submissionOpt = submissionRepository.findById(id);
        if (submissionOpt.isPresent()) {
            return ResponseEntity.ok(toResponse(submissionOpt.get()));
        } else {
            return ResponseEntity.status(404).body("Submission not found with id: " + id);
        }
    }

    // Grade/provide feedback
    @PutMapping("/{id}")
    public ResponseEntity<?> gradeSubmission(@PathVariable Long id, @RequestBody AssignmentSubmissionRequest request) {
        Optional<AssignmentSubmission> submissionOpt = submissionRepository.findById(id);
        if (submissionOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Submission not found with id: " + id);
        }
        AssignmentSubmission submission = submissionOpt.get();
        if (request.getGrade() != null) submission.setGrade(request.getGrade());
        if (request.getFeedback() != null) submission.setFeedback(request.getFeedback());
        submissionRepository.save(submission);
        return ResponseEntity.ok(toResponse(submission));
    }
} 