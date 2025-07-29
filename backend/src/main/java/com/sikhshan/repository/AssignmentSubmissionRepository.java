package com.sikhshan.repository;

import com.sikhshan.model.AssignmentSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface AssignmentSubmissionRepository extends JpaRepository<AssignmentSubmission, Long> {
    List<AssignmentSubmission> findByAssignmentId(Long assignmentId);
    List<AssignmentSubmission> findByStudentId(Long studentId);
    List<AssignmentSubmission> findByAssignmentIdAndStudentId(Long assignmentId, Long studentId);
    
    @Query("SELECT s FROM AssignmentSubmission s WHERE s.assignment.id = :assignmentId ORDER BY s.submittedAt DESC")
    List<AssignmentSubmission> findByAssignmentIdOrderBySubmittedAtDesc(@Param("assignmentId") Long assignmentId);
    
    @Query("SELECT s FROM AssignmentSubmission s WHERE s.assignment.id = :assignmentId AND s.student.id = :studentId ORDER BY s.submissionNumber DESC")
    List<AssignmentSubmission> findLatestSubmissionByAssignmentAndStudent(@Param("assignmentId") Long assignmentId, @Param("studentId") Long studentId);
    
    Optional<AssignmentSubmission> findTopByAssignmentIdAndStudentIdOrderBySubmissionNumberDesc(Long assignmentId, Long studentId);
    
    @Query("SELECT s FROM AssignmentSubmission s WHERE s.assignment.id = :assignmentId AND s.status LIKE '%GRADED%'")
    List<AssignmentSubmission> findGradedSubmissionsByAssignment(@Param("assignmentId") Long assignmentId);
    
    @Query("SELECT s FROM AssignmentSubmission s WHERE s.assignment.id = :assignmentId AND s.status LIKE '%LATE%'")
    List<AssignmentSubmission> findLateSubmissionsByAssignment(@Param("assignmentId") Long assignmentId);
    
    @Query("SELECT s FROM AssignmentSubmission s WHERE s.student.id = :studentId AND s.assignment.course.id = :courseId")
    List<AssignmentSubmission> findByStudentIdAndCourseId(@Param("studentId") Long studentId, @Param("courseId") Long courseId);
} 