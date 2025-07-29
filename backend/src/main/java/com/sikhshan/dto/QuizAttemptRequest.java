package com.sikhshan.dto;

import java.time.LocalDateTime;
import java.util.Map;

public class QuizAttemptRequest {
    private Long id;
    private Long quizId;
    private Long studentId;
    private LocalDateTime startedAt;
    private LocalDateTime submittedAt;
    private Double score;
    private Integer pointsEarned;
    private Double percentage;
    private String letterGrade;
    private String answers; // JSON string of student answers
    private String status;
    private Map<String, String> studentAnswers; // Question ID -> Answer mapping
    private String performanceDescription;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getQuizId() { return quizId; }
    public void setQuizId(Long quizId) { this.quizId = quizId; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }

    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }

    public Double getScore() { return score; }
    public void setScore(Double score) { this.score = score; }

    public Integer getPointsEarned() { return pointsEarned; }
    public void setPointsEarned(Integer pointsEarned) { this.pointsEarned = pointsEarned; }

    public Double getPercentage() { return percentage; }
    public void setPercentage(Double percentage) { this.percentage = percentage; }

    public String getLetterGrade() { return letterGrade; }
    public void setLetterGrade(String letterGrade) { this.letterGrade = letterGrade; }

    public String getAnswers() { return answers; }
    public void setAnswers(String answers) { this.answers = answers; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Map<String, String> getStudentAnswers() { return studentAnswers; }
    public void setStudentAnswers(Map<String, String> studentAnswers) { this.studentAnswers = studentAnswers; }
    
    public String getPerformanceDescription() { return performanceDescription; }
    public void setPerformanceDescription(String performanceDescription) { this.performanceDescription = performanceDescription; }
} 