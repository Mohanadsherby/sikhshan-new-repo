package com.sikhshan.dto;

import java.time.LocalDateTime;
import java.util.List;

public class QuizRequest {
    private String name;
    private String description;
    private LocalDateTime startDateTime;
    private Integer durationMinutes;
    private Integer totalPoints = 100;
    private String status = "ACTIVE";
    private Long courseId;
    private Long instructorId;
    private List<QuestionRequest> questions;

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

    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }

    public Long getInstructorId() { return instructorId; }
    public void setInstructorId(Long instructorId) { this.instructorId = instructorId; }

    public List<QuestionRequest> getQuestions() { return questions; }
    public void setQuestions(List<QuestionRequest> questions) { this.questions = questions; }
} 