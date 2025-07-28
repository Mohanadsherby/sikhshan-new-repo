package com.sikhshan.dto;

import java.time.LocalDateTime;

public class AssignmentResponse {
    private Long id;
    private String name;
    private String description;
    private LocalDateTime dueDate;
    private LocalDateTime createdAt;
    private String status;
    private String cloudinaryUrl;
    private String originalFileName;
    private Long courseId;
    private String courseName;
    private Long instructorId;
    private String instructorName;
    private String instructorProfilePictureUrl;
    private boolean isOverdue;
    private int submissionCount;
    private int gradedCount;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getDueDate() { return dueDate; }
    public void setDueDate(LocalDateTime dueDate) { this.dueDate = dueDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCloudinaryUrl() { return cloudinaryUrl; }
    public void setCloudinaryUrl(String cloudinaryUrl) { this.cloudinaryUrl = cloudinaryUrl; }

    public String getOriginalFileName() { return originalFileName; }
    public void setOriginalFileName(String originalFileName) { this.originalFileName = originalFileName; }

    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }

    public String getCourseName() { return courseName; }
    public void setCourseName(String courseName) { this.courseName = courseName; }

    public Long getInstructorId() { return instructorId; }
    public void setInstructorId(Long instructorId) { this.instructorId = instructorId; }

    public String getInstructorName() { return instructorName; }
    public void setInstructorName(String instructorName) { this.instructorName = instructorName; }

    public String getInstructorProfilePictureUrl() { return instructorProfilePictureUrl; }
    public void setInstructorProfilePictureUrl(String instructorProfilePictureUrl) { this.instructorProfilePictureUrl = instructorProfilePictureUrl; }

    public boolean isOverdue() { return isOverdue; }
    public void setOverdue(boolean overdue) { isOverdue = overdue; }

    public int getSubmissionCount() { return submissionCount; }
    public void setSubmissionCount(int submissionCount) { this.submissionCount = submissionCount; }

    public int getGradedCount() { return gradedCount; }
    public void setGradedCount(int gradedCount) { this.gradedCount = gradedCount; }
} 