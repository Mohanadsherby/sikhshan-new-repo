package com.sikhshan.dto;

import java.time.LocalDateTime;

public class AssignmentSubmissionResponse {
    private Long id;
    private Long assignmentId;
    private String assignmentName;
    private Long studentId;
    private String studentName;
    private String studentProfilePictureUrl;
    private LocalDateTime submittedAt;
    private LocalDateTime lastModifiedAt;
    private String status;
    private String cloudinaryUrl;
    private String originalFileName;
    private Double grade; // Numeric grade (0-100) - calculated from pointsEarned/totalPoints
    private Integer pointsEarned; // Actual points given by teacher (0 to totalPoints)
    private String letterGrade; // A, B, C, D, F, etc.
    private Double gradePoint; // Grade point (1.6 - 4.0)
    private String performanceDescription; // Outstanding, Excellent, etc.
    private String feedback;
    private LocalDateTime gradedAt;
    private Integer submissionNumber;
    private Boolean isLate;
    private Long courseId;
    private String courseName;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getAssignmentId() { return assignmentId; }
    public void setAssignmentId(Long assignmentId) { this.assignmentId = assignmentId; }

    public String getAssignmentName() { return assignmentName; }
    public void setAssignmentName(String assignmentName) { this.assignmentName = assignmentName; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getStudentProfilePictureUrl() { return studentProfilePictureUrl; }
    public void setStudentProfilePictureUrl(String studentProfilePictureUrl) { this.studentProfilePictureUrl = studentProfilePictureUrl; }

    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }

    public LocalDateTime getLastModifiedAt() { return lastModifiedAt; }
    public void setLastModifiedAt(LocalDateTime lastModifiedAt) { this.lastModifiedAt = lastModifiedAt; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCloudinaryUrl() { return cloudinaryUrl; }
    public void setCloudinaryUrl(String cloudinaryUrl) { this.cloudinaryUrl = cloudinaryUrl; }

    public String getOriginalFileName() { return originalFileName; }
    public void setOriginalFileName(String originalFileName) { this.originalFileName = originalFileName; }

    public Double getGrade() { return grade; }
    public void setGrade(Double grade) { this.grade = grade; }

    public Integer getPointsEarned() { return pointsEarned; }
    public void setPointsEarned(Integer pointsEarned) { this.pointsEarned = pointsEarned; }

    public String getLetterGrade() { return letterGrade; }
    public void setLetterGrade(String letterGrade) { this.letterGrade = letterGrade; }

    public Double getGradePoint() { return gradePoint; }
    public void setGradePoint(Double gradePoint) { this.gradePoint = gradePoint; }

    public String getPerformanceDescription() { return performanceDescription; }
    public void setPerformanceDescription(String performanceDescription) { this.performanceDescription = performanceDescription; }

    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }

    public LocalDateTime getGradedAt() { return gradedAt; }
    public void setGradedAt(LocalDateTime gradedAt) { this.gradedAt = gradedAt; }

    public Integer getSubmissionNumber() { return submissionNumber; }
    public void setSubmissionNumber(Integer submissionNumber) { this.submissionNumber = submissionNumber; }

    public Boolean getIsLate() { return isLate; }
    public void setIsLate(Boolean isLate) { this.isLate = isLate; }

    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }

    public String getCourseName() { return courseName; }
    public void setCourseName(String courseName) { this.courseName = courseName; }
} 