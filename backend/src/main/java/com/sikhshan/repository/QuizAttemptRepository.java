package com.sikhshan.repository;

import com.sikhshan.model.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    List<QuizAttempt> findByQuizId(Long quizId);
    List<QuizAttempt> findByStudentId(Long studentId);
    List<QuizAttempt> findByQuizIdAndStudentId(Long quizId, Long studentId);
    Optional<QuizAttempt> findByQuizIdAndStudentIdAndStatus(Long quizId, Long studentId, String status);
    List<QuizAttempt> findByQuizIdOrderByStartedAtDesc(Long quizId);
    List<QuizAttempt> findByStudentIdOrderByStartedAtDesc(Long studentId);
    
    List<QuizAttempt> findByQuizAndStudent(com.sikhshan.model.Quiz quiz, com.sikhshan.model.User student);
} 