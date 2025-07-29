package com.sikhshan.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "quiz_attempt")
public class QuizAttempt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "quiz_id")
    private Quiz quiz;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private User student;

    @NotNull
    private LocalDateTime startedAt;
    
    private LocalDateTime submittedAt;
    
    private Double score;
    
    private Integer pointsEarned;
    
    private Double percentage;
    
    private String letterGrade;
    
    @Column(columnDefinition = "TEXT")
    private String answers; // JSON string of student answers
    
    private String status = "IN_PROGRESS"; // IN_PROGRESS, SUBMITTED, GRADED
    
    private String performanceDescription;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Quiz getQuiz() { return quiz; }
    public void setQuiz(Quiz quiz) { this.quiz = quiz; }

    public User getStudent() { return student; }
    public void setStudent(User student) { this.student = student; }

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
    
    public String getPerformanceDescription() { return performanceDescription; }
    public void setPerformanceDescription(String performanceDescription) { this.performanceDescription = performanceDescription; }
} 