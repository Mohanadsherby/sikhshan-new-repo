package com.sikhshan.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.sikhshan.model.Course;
import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long> {

    List<Course> findByInstructorId(Long instructorId);
    List<Course> findByEnrollmentsStudentId(Long studentId);
}