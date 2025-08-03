package com.sikhshan.dto;

import java.time.LocalDateTime;

public class CourseGradeResponse {
    private Long id;
    private Long studentId;
    private String studentName;
    private String studentEmail;
    private Long courseId;
    private String courseName;
    private String courseCode;
    
    // Assignment grades
    private Double assignmentTotalPoints;
    private Double assignmentPointsEarned;
    private Double assignmentPercentage;
    private Integer assignmentCount;
    private Integer assignmentGradedCount;
    
    // Quiz grades
    private Double quizTotalPoints;
    private Double quizPointsEarned;
    private Double quizPercentage;
    private Integer quizCount;
    private Integer quizAttemptedCount;
    
    // Overall course grade
    private Double totalPoints;
    private Double pointsEarned;
    private Double finalPercentage;
    private String letterGrade;
    private Double gradePoint;
    private String performanceDescription;
    
    // Grading weights
    private Double assignmentWeight;
    private Double quizWeight;
    
    // Timestamps
    private LocalDateTime lastUpdated;
    private LocalDateTime createdAt;
    private String status;

    // Constructors
    public CourseGradeResponse() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getStudentEmail() { return studentEmail; }
    public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }

    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }

    public String getCourseName() { return courseName; }
    public void setCourseName(String courseName) { this.courseName = courseName; }

    public String getCourseCode() { return courseCode; }
    public void setCourseCode(String courseCode) { this.courseCode = courseCode; }

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