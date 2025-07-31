package com.sikhshan.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.sikhshan.model.Enrollment;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
	
	Optional<Enrollment> findByStudentIdAndCourseId(Long studentId, Long courseId);
	
	List<Enrollment> findByStudentId(Long studentId);
	
	List<Enrollment> findByCourseId(Long courseId);
	
	// Find enrollments by course instructor ID
	@Query("SELECT e FROM Enrollment e WHERE e.course.instructor.id = :instructorId")
	List<Enrollment> findByCourseInstructorId(@Param("instructorId") Long instructorId);
} 