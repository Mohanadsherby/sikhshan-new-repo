package com.sikhshan.repository;

import com.sikhshan.model.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    List<Assignment> findByCourseId(Long courseId);
    List<Assignment> findByInstructorId(Long instructorId);
    List<Assignment> findByCourseIdAndStatus(Long courseId, String status);
    List<Assignment> findByInstructorIdAndStatus(Long instructorId, String status);
    
    @Query("SELECT a FROM Assignment a WHERE a.course.id = :courseId AND a.dueDate >= :now ORDER BY a.dueDate ASC")
    List<Assignment> findActiveAssignmentsByCourse(@Param("courseId") Long courseId, @Param("now") LocalDateTime now);
    
    @Query("SELECT a FROM Assignment a WHERE a.course.id = :courseId AND a.dueDate < :now ORDER BY a.dueDate DESC")
    List<Assignment> findOverdueAssignmentsByCourse(@Param("courseId") Long courseId, @Param("now") LocalDateTime now);
    
    Optional<Assignment> findByIdAndStatus(Long id, String status);
} 