package com.sikhshan.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class AssignmentRequest {
    @NotBlank(message = "Assignment name is required")
    private String name;
    
    private String description;
    
    @NotNull(message = "Due date is required")
    private LocalDateTime dueDate;
    
    private String status;
    
    @NotNull(message = "Course ID is required")
    private Long courseId;
    private Integer totalPoints = 100; // Default to 100 points

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getDueDate() { return dueDate; }
    public void setDueDate(LocalDateTime dueDate) { this.dueDate = dueDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }

    public Integer getTotalPoints() { return totalPoints; }
    public void setTotalPoints(Integer totalPoints) { this.totalPoints = totalPoints; }
} 