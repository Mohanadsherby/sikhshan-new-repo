package com.sikhshan.restcontroller;

import com.sikhshan.dto.QuizAttemptRequest;
import com.sikhshan.dto.QuizAttemptResponse;
import com.sikhshan.model.Quiz;
import com.sikhshan.model.QuizAttempt;
import com.sikhshan.model.Question;
import com.sikhshan.model.User;
import com.sikhshan.repository.QuizAttemptRepository;
import com.sikhshan.repository.QuizRepository;
import com.sikhshan.repository.QuestionRepository;
import com.sikhshan.repository.UserRepository;
import com.sikhshan.utility.QuizScoringUtility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/quiz-attempts")
public class QuizAttemptController {
    @Autowired
    private QuizAttemptRepository attemptRepository;
    @Autowired
    private QuizRepository quizRepository;
    @Autowired
    private QuestionRepository questionRepository;
    @Autowired
    private UserRepository userRepository;

    private QuizAttemptResponse toResponse(QuizAttempt attempt) {
        QuizAttemptResponse resp = new QuizAttemptResponse();
        resp.setId(attempt.getId());
        
        if (attempt.getQuiz() != null) {
            resp.setQuizId(attempt.getQuiz().getId());
            resp.setQuizName(attempt.getQuiz().getName());
            resp.setTotalPoints(attempt.getQuiz().getTotalPoints());
        }
        
        if (attempt.getStudent() != null) {
            resp.setStudentId(attempt.getStudent().getId());
            resp.setStudentName(attempt.getStudent().getName());
        }
        
        resp.setStartedAt(attempt.getStartedAt());
        resp.setSubmittedAt(attempt.getSubmittedAt());
        resp.setScore(attempt.getScore());
        resp.setPointsEarned(attempt.getPointsEarned());
        resp.setPercentage(attempt.getPercentage());
        resp.setLetterGrade(attempt.getLetterGrade());
        resp.setAnswers(attempt.getAnswers());
        resp.setStatus(attempt.getStatus());
        resp.setPerformanceDescription(attempt.getPerformanceDescription());
        
        return resp;
    }

    // Start a new quiz attempt
    @PostMapping("/start")
    public ResponseEntity<?> startQuizAttempt(@RequestBody QuizAttemptRequest request) {
        try {
            Optional<Quiz> quizOpt = quizRepository.findById(request.getQuizId());
            Optional<User> studentOpt = userRepository.findById(request.getStudentId());
            
            if (quizOpt.isEmpty() || studentOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Invalid quiz or student ID");
            }
            
            Quiz quiz = quizOpt.get();
            User student = studentOpt.get();
            
            // Check if quiz is active
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime endTime = quiz.getStartDateTime().plusMinutes(quiz.getDurationMinutes());
            
            if (now.isBefore(quiz.getStartDateTime())) {
                return ResponseEntity.badRequest().body("Quiz has not started yet");
            }
            
            if (now.isAfter(endTime)) {
                return ResponseEntity.badRequest().body("Quiz has ended");
            }
            
            // Check if student already has an active attempt
            Optional<QuizAttempt> existingAttempt = attemptRepository.findByQuizIdAndStudentIdAndStatus(
                request.getQuizId(), request.getStudentId(), "IN_PROGRESS");
            
            if (existingAttempt.isPresent()) {
                return ResponseEntity.badRequest().body("You already have an active attempt for this quiz");
            }
            
            // Create new attempt
            QuizAttempt attempt = new QuizAttempt();
            attempt.setQuiz(quiz);
            attempt.setStudent(student);
            attempt.setStartedAt(now);
            attempt.setStatus("IN_PROGRESS");
            
            QuizAttempt savedAttempt = attemptRepository.save(attempt);
            return ResponseEntity.ok(toResponse(savedAttempt));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error starting quiz attempt: " + e.getMessage());
        }
    }

    // Submit quiz attempt with automatic scoring
    @PostMapping("/submit")
    public ResponseEntity<?> submitQuizAttempt(@RequestBody QuizAttemptRequest request) {
        try {
            Optional<QuizAttempt> attemptOpt = attemptRepository.findById(request.getId());
            if (attemptOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Quiz attempt not found");
            }
            
            QuizAttempt attempt = attemptOpt.get();
            Quiz quiz = attempt.getQuiz();
            
            // Check if quiz is still active
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime endTime = quiz.getStartDateTime().plusMinutes(quiz.getDurationMinutes());
            
            if (now.isAfter(endTime)) {
                return ResponseEntity.badRequest().body("Quiz has ended. Cannot submit after time limit");
            }
            
            // Validate that this is the correct attempt
            if (attempt.getStudent().getId() != request.getStudentId()) {
                return ResponseEntity.badRequest().body("Unauthorized attempt submission");
            }
            
            // Parse student answers
            Map<String, String> studentAnswers = request.getStudentAnswers();
            if (studentAnswers == null || studentAnswers.isEmpty()) {
                return ResponseEntity.badRequest().body("No answers provided");
            }
            
            // Get questions for scoring
            List<Question> questions = questionRepository.findByQuizIdOrderById(quiz.getId());
            
            // Calculate score automatically
            QuizScoringUtility.QuizScoreResult scoreResult = QuizScoringUtility.calculateScore(questions, studentAnswers);
            
            // Update attempt
            attempt.setSubmittedAt(now);
            attempt.setPointsEarned(scoreResult.getPointsEarned());
            attempt.setPercentage(scoreResult.getPercentage());
            attempt.setLetterGrade(scoreResult.getLetterGrade());
            attempt.setPerformanceDescription(scoreResult.getPerformanceDescription());
            attempt.setStatus("SUBMITTED");
            attempt.setAnswers(QuizScoringUtility.serializeStudentAnswers(studentAnswers));
            
            QuizAttempt savedAttempt = attemptRepository.save(attempt);
            return ResponseEntity.ok(toResponse(savedAttempt));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error submitting quiz attempt: " + e.getMessage());
        }
    }

    // Get attempt by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getAttemptById(@PathVariable Long id) {
        Optional<QuizAttempt> attemptOpt = attemptRepository.findById(id);
        if (attemptOpt.isPresent()) {
            return ResponseEntity.ok(toResponse(attemptOpt.get()));
        } else {
            return ResponseEntity.status(404).body("Quiz attempt not found with id: " + id);
        }
    }

    // Get student's attempt for a specific quiz
    @GetMapping("/quiz/{quizId}/student/{studentId}")
    public ResponseEntity<?> getStudentAttemptForQuiz(@PathVariable Long quizId, @PathVariable Long studentId) {
        // First check for IN_PROGRESS attempt
        Optional<QuizAttempt> inProgressAttempt = attemptRepository.findByQuizIdAndStudentIdAndStatus(quizId, studentId, "IN_PROGRESS");
        if (inProgressAttempt.isPresent()) {
            return ResponseEntity.ok(toResponse(inProgressAttempt.get()));
        }
        
        // Then check for SUBMITTED attempt
        Optional<QuizAttempt> submittedAttempt = attemptRepository.findByQuizIdAndStudentIdAndStatus(quizId, studentId, "SUBMITTED");
        if (submittedAttempt.isPresent()) {
            return ResponseEntity.ok(toResponse(submittedAttempt.get()));
        }
        
        return ResponseEntity.status(404).body("No attempt found for this quiz");
    }

    // List attempts for a quiz
    @GetMapping("/quiz/{quizId}")
    public ResponseEntity<List<QuizAttemptResponse>> getAttemptsByQuiz(@PathVariable Long quizId) {
        List<QuizAttempt> attempts = attemptRepository.findByQuizIdOrderByStartedAtDesc(quizId);
        List<QuizAttemptResponse> responses = attempts.stream().map(this::toResponse).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // List attempts by a student
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<QuizAttemptResponse>> getAttemptsByStudent(@PathVariable Long studentId) {
        List<QuizAttempt> attempts = attemptRepository.findByStudentIdOrderByStartedAtDesc(studentId);
        List<QuizAttemptResponse> responses = attempts.stream().map(this::toResponse).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // Get quiz time remaining for a student
    @GetMapping("/quiz/{quizId}/time-remaining/{studentId}")
    public ResponseEntity<?> getTimeRemaining(@PathVariable Long quizId, @PathVariable Long studentId) {
        try {
            Optional<Quiz> quizOpt = quizRepository.findById(quizId);
            Optional<QuizAttempt> attemptOpt = attemptRepository.findByQuizIdAndStudentIdAndStatus(quizId, studentId, "IN_PROGRESS");
            
            if (quizOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Quiz not found");
            }
            
            Quiz quiz = quizOpt.get();
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime endTime = quiz.getStartDateTime().plusMinutes(quiz.getDurationMinutes());
            
            if (now.isAfter(endTime)) {
                return ResponseEntity.ok(Map.of("timeRemaining", 0, "message", "Quiz has ended"));
            }
            
            if (attemptOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("No active attempt found");
            }
            
            QuizAttempt attempt = attemptOpt.get();
            LocalDateTime startedAt = attempt.getStartedAt();
            LocalDateTime personalEndTime = startedAt.plusMinutes(quiz.getDurationMinutes());
            
            long timeRemaining = java.time.Duration.between(now, personalEndTime).toMinutes();
            if (timeRemaining < 0) timeRemaining = 0;
            
            return ResponseEntity.ok(Map.of(
                "timeRemaining", timeRemaining,
                "startedAt", startedAt,
                "personalEndTime", personalEndTime,
                "quizEndTime", endTime
            ));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error calculating time remaining: " + e.getMessage());
        }
    }

    // Update attempt (for admin/faculty use)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateQuizAttempt(@PathVariable Long id, @RequestBody QuizAttemptRequest request) {
        Optional<QuizAttempt> attemptOpt = attemptRepository.findById(id);
        if (attemptOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Quiz attempt not found with id: " + id);
        }
        
        try {
            QuizAttempt attempt = attemptOpt.get();
            
            if (request.getScore() != null) attempt.setScore(request.getScore());
            if (request.getPointsEarned() != null) attempt.setPointsEarned(request.getPointsEarned());
            if (request.getPercentage() != null) attempt.setPercentage(request.getPercentage());
            if (request.getLetterGrade() != null) attempt.setLetterGrade(request.getLetterGrade());
            if (request.getAnswers() != null) attempt.setAnswers(request.getAnswers());
            if (request.getStatus() != null) attempt.setStatus(request.getStatus());
            if (request.getStartedAt() != null) attempt.setStartedAt(request.getStartedAt());
            if (request.getSubmittedAt() != null) attempt.setSubmittedAt(request.getSubmittedAt());
            
            QuizAttempt savedAttempt = attemptRepository.save(attempt);
            return ResponseEntity.ok(toResponse(savedAttempt));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating quiz attempt: " + e.getMessage());
        }
    }
} 