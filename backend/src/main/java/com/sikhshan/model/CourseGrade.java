package com.sikhshan.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "course_grade")
public class CourseGrade {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    // Assignment grades
    private Double assignmentTotalPoints = 0.0;
    private Double assignmentPointsEarned = 0.0;
    private Double assignmentPercentage = 0.0;
    private Integer assignmentCount = 0;
    private Integer assignmentGradedCount = 0;

    // Quiz grades
    private Double quizTotalPoints = 0.0;
    private Double quizPointsEarned = 0.0;
    private Double quizPercentage = 0.0;
    private Integer quizCount = 0;
    private Integer quizAttemptedCount = 0;

    // Overall course grade
    private Double totalPoints = 0.0;
    private Double pointsEarned = 0.0;
    private Double finalPercentage = 0.0;
    private String letterGrade;
    private Double gradePoint; // GPA (0.0 - 4.0)
    private String performanceDescription;

    // Grading weights (configurable by instructor)
    private Double assignmentWeight = 60.0; // Default 60% for assignments
    private Double quizWeight = 40.0; // Default 40% for quizzes

    // Timestamps
    private LocalDateTime lastUpdated;
    private LocalDateTime createdAt;

    // Status
    private String status = "ACTIVE"; // ACTIVE, INACTIVE, FINALIZED

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        lastUpdated = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        lastUpdated = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getStudent() { return student; }
    public void setStudent(User student) { this.student = student; }

    public Course getCourse() { return course; }
    public void setCourse(Course course) { this.course = course; }

    public Double getAssignmentTotalPoints() { return assignmentTotalPoints; }
    public void setAssignmentTotalPoints(Double assignmentTotalPoints) { this.assignmentTotalPoints = assignmentTotalPoints; }

    public Double getAssignmentPointsEarned() { return assignmentPointsEarned; }
    public void setAssignmentPointsEarned(Double assignmentPointsEarned) { this.assignmentPointsEarned = assignmentPointsEarned; }

    public Double getAssignmentPercentage() { return assignmentPercentage; }
    public void setAssignmentPercentage(Double assignmentPercentage) { this.assignmentPercentage = assignmentPercentage; }

    public Integer getAssignmentCount() { return assignmentCount; }
    public void setAssignmentCount(Integer assignmentCount) { this.assignmentCount = assignmentCount; }

    public Integer getAssignmentGradedCount() { return assignmentGradedCount; }
    public void setAssignmentGradedCount(Integer assignmentGradedCount) { this.assignmentGradedCount = assignmentGradedCount; }

    public Double getQuizTotalPoints() { return quizTotalPoints; }
    public void setQuizTotalPoints(Double quizTotalPoints) { this.quizTotalPoints = quizTotalPoints; }

    public Double getQuizPointsEarned() { return quizPointsEarned; }
    public void setQuizPointsEarned(Double quizPointsEarned) { this.quizPointsEarned = quizPointsEarned; }

    public Double getQuizPercentage() { return quizPercentage; }
    public void setQuizPercentage(Double quizPercentage) { this.quizPercentage = quizPercentage; }

    public Integer getQuizCount() { return quizCount; }
    public void setQuizCount(Integer quizCount) { this.quizCount = quizCount; }

    public Integer getQuizAttemptedCount() { return quizAttemptedCount; }
    public void setQuizAttemptedCount(Integer quizAttemptedCount) { this.quizAttemptedCount = quizAttemptedCount; }

    public Double getTotalPoints() { return totalPoints; }
    public void setTotalPoints(Double totalPoints) { this.totalPoints = totalPoints; }

    public Double getPointsEarned() { return pointsEarned; }
    public void setPointsEarned(Double pointsEarned) { this.pointsEarned = pointsEarned; }

    public Double getFinalPercentage() { return finalPercentage; }
    public void setFinalPercentage(Double finalPercentage) { this.finalPercentage = finalPercentage; }

    public String getLetterGrade() { return letterGrade; }
    public void setLetterGrade(String letterGrade) { this.letterGrade = letterGrade; }

    public Double getGradePoint() { return gradePoint; }
    public void setGradePoint(Double gradePoint) { this.gradePoint = gradePoint; }

    public String getPerformanceDescription() { return performanceDescription; }
    public void setPerformanceDescription(String performanceDescription) { this.performanceDescription = performanceDescription; }

    public Double getAssignmentWeight() { return assignmentWeight; }
    public void setAssignmentWeight(Double assignmentWeight) { this.assignmentWeight = assignmentWeight; }

    public Double getQuizWeight() { return quizWeight; }
    public void setQuizWeight(Double quizWeight) { this.quizWeight = quizWeight; }

    public LocalDateTime getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
} 