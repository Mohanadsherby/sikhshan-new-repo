package com.sikhshan.dto;

import java.time.LocalDateTime;
import java.util.List;

public class QuizResponse {
    private Long id;
    private String name;
    private String description;
    private LocalDateTime startDateTime;
    private Integer durationMinutes;
    private Integer totalPoints;
    private String status;
    private LocalDateTime createdAt;
    private Long courseId;
    private String courseName;
    private Long instructorId;
    private String instructorName;
    private boolean isActive;
    private boolean isOverdue;
    private int attemptCount;
    private List<QuestionResponse> questions;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getStartDateTime() { return startDateTime; }
    public void setStartDateTime(LocalDateTime startDateTime) { this.startDateTime = startDateTime; }

    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }

    public Integer getTotalPoints() { return totalPoints; }
    public void setTotalPoints(Integer totalPoints) { this.totalPoints = totalPoints; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }

    public String getCourseName() { return courseName; }
    public void setCourseName(String courseName) { this.courseName = courseName; }

    public Long getInstructorId() { return instructorId; }
    public void setInstructorId(Long instructorId) { this.instructorId = instructorId; }

    public String getInstructorName() { return instructorName; }
    public void setInstructorName(String instructorName) { this.instructorName = instructorName; }

    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }

    public boolean isOverdue() { return isOverdue; }
    public void setOverdue(boolean overdue) { isOverdue = overdue; }

    public int getAttemptCount() { return attemptCount; }
    public void setAttemptCount(int attemptCount) { this.attemptCount = attemptCount; }

    public List<QuestionResponse> getQuestions() { return questions; }
    public void setQuestions(List<QuestionResponse> questions) { this.questions = questions; }
} 