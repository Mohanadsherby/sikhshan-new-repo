package com.sikhshan.dto;

import java.time.LocalDateTime;

public class QuizAttemptResponse {
    private Long id;
    private Long quizId;
    private String quizName;
    private Long studentId;
    private String studentName;
    private LocalDateTime startedAt;
    private LocalDateTime submittedAt;
    private Double score;
    private String answers;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getQuizId() { return quizId; }
    public void setQuizId(Long quizId) { this.quizId = quizId; }

    public String getQuizName() { return quizName; }
    public void setQuizName(String quizName) { this.quizName = quizName; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }

    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }

    public Double getScore() { return score; }
    public void setScore(Double score) { this.score = score; }

    public String getAnswers() { return answers; }
    public void setAnswers(String answers) { this.answers = answers; }
} 