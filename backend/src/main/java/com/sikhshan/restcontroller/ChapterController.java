package com.sikhshan.restcontroller;

import com.sikhshan.dto.ChapterRequest;
import com.sikhshan.dto.ChapterResponse;
import com.sikhshan.dto.CourseAttachmentResponse;
import com.sikhshan.model.Chapter;
import com.sikhshan.model.Course;
import com.sikhshan.model.CourseAttachment;
import com.sikhshan.repository.ChapterRepository;
import com.sikhshan.repository.CourseRepository;
import com.sikhshan.repository.CourseAttachmentRepository;
import com.sikhshan.service.CloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chapters")
@CrossOrigin(origins = "*")
public class ChapterController {

    @Autowired
    private ChapterRepository chapterRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private CourseAttachmentRepository attachmentRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    // Get all chapters for a course
    @GetMapping("/course/{courseId}")
    public ResponseEntity<?> getChaptersByCourse(@PathVariable Long courseId) {
        try {
            Optional<Course> courseOpt = courseRepository.findById(courseId);
            if (courseOpt.isEmpty()) {
                return ResponseEntity.status(404).body("Course not found");
            }

            List<Chapter> chapters = chapterRepository.findByCourseIdOrderByChapterNumberAsc(courseId);
            List<ChapterResponse> responses = chapters.stream()
                    .map(this::toResponse)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
        }
    }

    // Get a specific chapter
    @GetMapping("/{chapterId}")
    public ResponseEntity<?> getChapterById(@PathVariable Long chapterId) {
        try {
            Optional<Chapter> chapterOpt = chapterRepository.findById(chapterId);
            if (chapterOpt.isEmpty()) {
                return ResponseEntity.status(404).body("Chapter not found");
            }

            return ResponseEntity.ok(toResponse(chapterOpt.get()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
        }
    }

    // Create a new chapter
    @PostMapping("/course/{courseId}")
    public ResponseEntity<?> createChapter(@PathVariable Long courseId, @Valid @RequestBody ChapterRequest request) {
        try {
            // Validate request
            if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
                return ResponseEntity.status(400).body("Chapter title is required");
            }
            if (request.getChapterNumber() == null || request.getChapterNumber() <= 0) {
                return ResponseEntity.status(400).body("Chapter number must be a positive integer");
            }

            Optional<Course> courseOpt = courseRepository.findById(courseId);
            if (courseOpt.isEmpty()) {
                return ResponseEntity.status(404).body("Course not found");
            }

            // Check if chapter number already exists
            Chapter existingChapter = chapterRepository.findByCourseIdAndChapterNumber(courseId, request.getChapterNumber());
            if (existingChapter != null) {
                return ResponseEntity.status(400).body("Chapter number " + request.getChapterNumber() + " already exists for this course");
            }

            Chapter chapter = new Chapter();
            chapter.setCourse(courseOpt.get());
            chapter.setTitle(request.getTitle().trim());
            chapter.setDescription(request.getDescription() != null ? request.getDescription().trim() : null);
            chapter.setChapterNumber(request.getChapterNumber());
            chapter.setCreatedAt(LocalDateTime.now());
            chapter.setUpdatedAt(LocalDateTime.now());

            Chapter savedChapter = chapterRepository.save(chapter);
            return ResponseEntity.ok(toResponse(savedChapter));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
        }
    }

    // Update a chapter
    @PutMapping("/{chapterId}")
    public ResponseEntity<?> updateChapter(@PathVariable Long chapterId, @Valid @RequestBody ChapterRequest request) {
        try {
            // Validate request
            if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
                return ResponseEntity.status(400).body("Chapter title is required");
            }
            if (request.getChapterNumber() == null || request.getChapterNumber() <= 0) {
                return ResponseEntity.status(400).body("Chapter number must be a positive integer");
            }

            Optional<Chapter> chapterOpt = chapterRepository.findById(chapterId);
            if (chapterOpt.isEmpty()) {
                return ResponseEntity.status(404).body("Chapter not found");
            }

            Chapter chapter = chapterOpt.get();

            // Check if new chapter number conflicts with existing chapters (excluding current chapter)
            if (!chapter.getChapterNumber().equals(request.getChapterNumber())) {
                Chapter existingChapter = chapterRepository.findByCourseIdAndChapterNumber(chapter.getCourse().getId(), request.getChapterNumber());
                if (existingChapter != null && !existingChapter.getId().equals(chapterId)) {
                    return ResponseEntity.status(400).body("Chapter number " + request.getChapterNumber() + " already exists for this course");
                }
            }

            chapter.setTitle(request.getTitle().trim());
            chapter.setDescription(request.getDescription() != null ? request.getDescription().trim() : null);
            chapter.setChapterNumber(request.getChapterNumber());
            chapter.setUpdatedAt(LocalDateTime.now());

            Chapter savedChapter = chapterRepository.save(chapter);
            return ResponseEntity.ok(toResponse(savedChapter));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
        }
    }

    // Delete a chapter
    @DeleteMapping("/{chapterId}")
    public ResponseEntity<?> deleteChapter(@PathVariable Long chapterId) {
        try {
            Optional<Chapter> chapterOpt = chapterRepository.findById(chapterId);
            if (chapterOpt.isEmpty()) {
                return ResponseEntity.status(404).body("Chapter not found");
            }

            Chapter chapter = chapterOpt.get();

            // Move all attachments to "no chapter" (set chapter to null)
            List<CourseAttachment> attachments = attachmentRepository.findByChapterId(chapterId);
            for (CourseAttachment attachment : attachments) {
                attachment.setChapter(null);
                attachmentRepository.save(attachment);
            }

            chapterRepository.delete(chapter);
            return ResponseEntity.ok("Chapter deleted successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
        }
    }

    // Upload attachment to a specific chapter
    @PostMapping("/{chapterId}/attachments")
    public ResponseEntity<?> uploadAttachmentToChapter(@PathVariable Long chapterId, @RequestParam("file") MultipartFile file) {
        try {
            Optional<Chapter> chapterOpt = chapterRepository.findById(chapterId);
            if (chapterOpt.isEmpty()) {
                return ResponseEntity.status(404).body("Chapter not found");
            }

            Chapter chapter = chapterOpt.get();
            Course course = chapter.getCourse();

            // Upload file to Cloudinary
            Map<String, Object> uploadResult = cloudinaryService.uploadCourseAttachment(file, course.getId());

            // Create attachment record
            CourseAttachment attachment = new CourseAttachment();
            attachment.setCourse(course);
            attachment.setChapter(chapter);
            attachment.setFileName(file.getOriginalFilename());
            attachment.setFileType(file.getContentType());
            attachment.setFileUrl((String) uploadResult.get("secure_url"));
            attachment.setCloudinaryPublicId((String) uploadResult.get("public_id"));
            attachment.setCloudinaryUrl((String) uploadResult.get("secure_url"));
            attachment.setUploadDate(LocalDateTime.now());

            CourseAttachment savedAttachment = attachmentRepository.save(attachment);
            return ResponseEntity.ok(toAttachmentResponse(savedAttachment));
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Failed to upload file: " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
        }
    }

    // Helper method to convert Chapter to ChapterResponse
    private ChapterResponse toResponse(Chapter chapter) {
        ChapterResponse response = new ChapterResponse();
        response.setId(chapter.getId());
        response.setTitle(chapter.getTitle());
        response.setDescription(chapter.getDescription());
        response.setChapterNumber(chapter.getChapterNumber());
        response.setCreatedAt(chapter.getCreatedAt());
        response.setUpdatedAt(chapter.getUpdatedAt());

        // Get attachments for this chapter
        List<CourseAttachment> attachments = attachmentRepository.findByChapterId(chapter.getId());
        List<CourseAttachmentResponse> attachmentResponses = attachments.stream()
                .map(this::toAttachmentResponse)
                .collect(Collectors.toList());
        response.setAttachments(attachmentResponses);

        return response;
    }

    // Helper method to convert CourseAttachment to CourseAttachmentResponse
    private CourseAttachmentResponse toAttachmentResponse(CourseAttachment attachment) {
        CourseAttachmentResponse response = new CourseAttachmentResponse();
        response.setId(attachment.getId());
        response.setFileName(attachment.getFileName());
        response.setFileType(attachment.getFileType());
        response.setFileUrl(attachment.getFileUrl());
        response.setUploadDate(attachment.getUploadDate());
        response.setCloudinaryPublicId(attachment.getCloudinaryPublicId());
        response.setCloudinaryUrl(attachment.getCloudinaryUrl());
        return response;
    }
} 