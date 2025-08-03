package com.sikhshan.repository;

import com.sikhshan.model.CourseGrade;
import com.sikhshan.model.Course;
import com.sikhshan.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseGradeRepository extends JpaRepository<CourseGrade, Long> {
    
    // Find by student and course
    Optional<CourseGrade> findByStudentAndCourse(User student, Course course);
    
    // Find by student ID and course ID
    @Query("SELECT cg FROM CourseGrade cg WHERE cg.student.id = :studentId AND cg.course.id = :courseId")
    Optional<CourseGrade> findByStudentIdAndCourseId(@Param("studentId") Long studentId, @Param("courseId") Long courseId);
    
    // Find all grades for a student
    List<CourseGrade> findByStudentOrderByCourseName(User student);
    
    // Find all grades for a course
    List<CourseGrade> findByCourseOrderByStudentName(Course course);
    
    // Find all grades for a student by course ID
    @Query("SELECT cg FROM CourseGrade cg WHERE cg.student.id = :studentId AND cg.course.id = :courseId")
    List<CourseGrade> findByStudentIdAndCourseIdList(@Param("studentId") Long studentId, @Param("courseId") Long courseId);
    
    // Find all grades for a course by course ID
    @Query("SELECT cg FROM CourseGrade cg WHERE cg.course.id = :courseId ORDER BY cg.student.name")
    List<CourseGrade> findByCourseId(@Param("courseId") Long courseId);
    
    // Find all grades for a student by student ID
    @Query("SELECT cg FROM CourseGrade cg WHERE cg.student.id = :studentId ORDER BY cg.course.name")
    List<CourseGrade> findByStudentId(@Param("studentId") Long studentId);
    
    // Check if grade exists for student and course
    boolean existsByStudentAndCourse(User student, Course course);
    
    // Find grades by status
    List<CourseGrade> findByStatus(String status);
    
    // Find grades by status and course
    List<CourseGrade> findByStatusAndCourse(String status, Course course);
} 