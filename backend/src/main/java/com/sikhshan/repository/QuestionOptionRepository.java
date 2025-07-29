package com.sikhshan.repository;

import com.sikhshan.model.QuestionOption;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QuestionOptionRepository extends JpaRepository<QuestionOption, Long> {
    List<QuestionOption> findByQuestionId(Long questionId);
    List<QuestionOption> findByQuestionIdOrderById(Long questionId);
} 