package com.sikhshan.repository;

import com.sikhshan.model.Chapter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChapterRepository extends JpaRepository<Chapter, Long> {
    List<Chapter> findByCourseIdOrderByChapterNumberAsc(Long courseId);
    Chapter findByCourseIdAndChapterNumber(Long courseId, Integer chapterNumber);
} 