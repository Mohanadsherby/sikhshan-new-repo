package com.sikhshan.dto;

import jakarta.validation.constraints.NotNull;

public class AssignmentSubmissionRequest {
    @NotNull(message = "Assignment ID is required")
    private Long assignmentId;
    
    @NotNull(message = "Student ID is required")
    private Long studentId;
    
    private String feedback;

    public Long getAssignmentId() { return assignmentId; }
    public void setAssignmentId(Long assignmentId) { this.assignmentId = assignmentId; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }
} 