package com.sikhshan.repository;

import com.sikhshan.model.CourseAttachment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CourseAttachmentRepository extends JpaRepository<CourseAttachment, Long> {
    List<CourseAttachment> findByCourseId(Long courseId);
    List<CourseAttachment> findByChapterId(Long chapterId);
    List<CourseAttachment> findByCourseIdAndChapterIsNull(Long courseId);
} 