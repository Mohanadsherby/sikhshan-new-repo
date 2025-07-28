package com.sikhshan.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "assignment_submission")
public class AssignmentSubmission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "assignment_id")
    private Assignment assignment;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "student_id")
    private User student;

    private LocalDateTime submittedAt;
    private LocalDateTime lastModifiedAt;
    
    // Submission status
    private String status; // SUBMITTED, GRADED, LATE_SUBMITTED, LATE_GRADED
    
    // Cloudinary fields for submission files
    private String cloudinaryPublicId;
    private String cloudinaryUrl;
    private String originalFileName;
    
    // Grading fields
    private Double grade; // Numeric grade (0-100)
    private String letterGrade; // A, B, C, D, F, etc.
    private String feedback;
    private LocalDateTime gradedAt;
    
    // Resubmission tracking
    private Integer submissionNumber; // 1, 2, 3, etc.
    private Boolean isLate; // true if submitted after due date

    // Pre-persist to set submission date
    @PrePersist
    protected void onCreate() {
        submittedAt = LocalDateTime.now();
        lastModifiedAt = LocalDateTime.now();
        if (submissionNumber == null) {
            submissionNumber = 1;
        }
        if (status == null) {
            status = "SUBMITTED";
        }
        // Check if submission is late
        if (assignment != null && assignment.getDueDate() != null) {
            isLate = submittedAt.isAfter(assignment.getDueDate());
            if (isLate) {
                status = "LATE_SUBMITTED";
            }
        }
    }

    @PreUpdate
    protected void onUpdate() {
        lastModifiedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Assignment getAssignment() { return assignment; }
    public void setAssignment(Assignment assignment) { this.assignment = assignment; }

    public User getStudent() { return student; }
    public void setStudent(User student) { this.student = student; }

    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }

    public LocalDateTime getLastModifiedAt() { return lastModifiedAt; }
    public void setLastModifiedAt(LocalDateTime lastModifiedAt) { this.lastModifiedAt = lastModifiedAt; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCloudinaryPublicId() { return cloudinaryPublicId; }
    public void setCloudinaryPublicId(String cloudinaryPublicId) { this.cloudinaryPublicId = cloudinaryPublicId; }

    public String getCloudinaryUrl() { return cloudinaryUrl; }
    public void setCloudinaryUrl(String cloudinaryUrl) { this.cloudinaryUrl = cloudinaryUrl; }

    public String getOriginalFileName() { return originalFileName; }
    public void setOriginalFileName(String originalFileName) { this.originalFileName = originalFileName; }

    public Double getGrade() { return grade; }
    public void setGrade(Double grade) { this.grade = grade; }

    public String getLetterGrade() { return letterGrade; }
    public void setLetterGrade(String letterGrade) { this.letterGrade = letterGrade; }

    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }

    public LocalDateTime getGradedAt() { return gradedAt; }
    public void setGradedAt(LocalDateTime gradedAt) { this.gradedAt = gradedAt; }

    public Integer getSubmissionNumber() { return submissionNumber; }
    public void setSubmissionNumber(Integer submissionNumber) { this.submissionNumber = submissionNumber; }

    public Boolean getIsLate() { return isLate; }
    public void setIsLate(Boolean isLate) { this.isLate = isLate; }
} 