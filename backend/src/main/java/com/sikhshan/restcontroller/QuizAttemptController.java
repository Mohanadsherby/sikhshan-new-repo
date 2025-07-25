package com.sikhshan.restcontroller;

import com.sikhshan.dto.QuizAttemptRequest;
import com.sikhshan.dto.QuizAttemptResponse;
import com.sikhshan.model.Quiz;
import com.sikhshan.model.QuizAttempt;
import com.sikhshan.model.User;
import com.sikhshan.repository.QuizAttemptRepository;
import com.sikhshan.repository.QuizRepository;
import com.sikhshan.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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
    private UserRepository userRepository;

    private QuizAttemptResponse toResponse(QuizAttempt attempt) {
        QuizAttemptResponse resp = new QuizAttemptResponse();
        resp.setId(attempt.getId());
        if (attempt.getQuiz() != null) {
            resp.setQuizId(attempt.getQuiz().getId());
            resp.setQuizName(attempt.getQuiz().getName());
        }
        if (attempt.getStudent() != null) {
            resp.setStudentId(attempt.getStudent().getId());
            resp.setStudentName(attempt.getStudent().getName());
        }
        resp.setStartedAt(attempt.getStartedAt());
        resp.setSubmittedAt(attempt.getSubmittedAt());
        resp.setScore(attempt.getScore());
        resp.setAnswers(attempt.getAnswers());
        return resp;
    }

    // Submit/attempt quiz
    @PostMapping
    public ResponseEntity<?> submitQuizAttempt(@RequestBody QuizAttemptRequest request) {
        Optional<Quiz> quizOpt = quizRepository.findById(request.getQuizId());
        Optional<User> studentOpt = userRepository.findById(request.getStudentId());
        if (quizOpt.isEmpty() || studentOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid quiz or student ID");
        }
        QuizAttempt attempt = new QuizAttempt();
        attempt.setQuiz(quizOpt.get());
        attempt.setStudent(studentOpt.get());
        attempt.setStartedAt(request.getStartedAt());
        attempt.setSubmittedAt(request.getSubmittedAt());
        attempt.setScore(request.getScore());
        attempt.setAnswers(request.getAnswers());
        attemptRepository.save(attempt);
        return ResponseEntity.ok(toResponse(attempt));
    }

    // List attempts for a quiz
    @GetMapping("/quiz/{quizId}")
    public ResponseEntity<List<QuizAttemptResponse>> getAttemptsByQuiz(@PathVariable Long quizId) {
        List<QuizAttempt> attempts = attemptRepository.findByQuizId(quizId);
        List<QuizAttemptResponse> responses = attempts.stream().map(this::toResponse).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // List attempts by a student
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<QuizAttemptResponse>> getAttemptsByStudent(@PathVariable Long studentId) {
        List<QuizAttempt> attempts = attemptRepository.findByStudentId(studentId);
        List<QuizAttemptResponse> responses = attempts.stream().map(this::toResponse).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
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

    // Update score/answers (for grading or regrading)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateQuizAttempt(@PathVariable Long id, @RequestBody QuizAttemptRequest request) {
        Optional<QuizAttempt> attemptOpt = attemptRepository.findById(id);
        if (attemptOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Quiz attempt not found with id: " + id);
        }
        QuizAttempt attempt = attemptOpt.get();
        if (request.getScore() != null) attempt.setScore(request.getScore());
        if (request.getAnswers() != null) attempt.setAnswers(request.getAnswers());
        if (request.getStartedAt() != null) attempt.setStartedAt(request.getStartedAt());
        if (request.getSubmittedAt() != null) attempt.setSubmittedAt(request.getSubmittedAt());
        attemptRepository.save(attempt);
        return ResponseEntity.ok(toResponse(attempt));
    }
} 