package com.sikhshan.restcontroller;

import com.sikhshan.dto.CourseAttachmentResponse;
import com.sikhshan.model.Course;
import com.sikhshan.model.CourseAttachment;
import com.sikhshan.repository.CourseAttachmentRepository;
import com.sikhshan.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/courses/{courseId}/attachments")
public class CourseAttachmentController {
    @Autowired
    private CourseAttachmentRepository attachmentRepository;
    @Autowired
    private CourseRepository courseRepository;

    @PostMapping
    public ResponseEntity<?> uploadAttachment(@PathVariable Long courseId, @RequestParam("file") MultipartFile file) {
        Optional<Course> courseOpt = courseRepository.findById(courseId);
        if (courseOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Course not found");
        }
        String uploadDir = "uploads/course-attachments/";
        File dir = new File(uploadDir);
        if (!dir.exists()) dir.mkdirs();
        String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filepath = Paths.get(uploadDir, filename);
        try {
            Files.write(filepath, file.getBytes());
            CourseAttachment attachment = new CourseAttachment();
            attachment.setCourse(courseOpt.get());
            attachment.setFileName(file.getOriginalFilename());
            attachment.setFileType(file.getContentType());
            attachment.setFileUrl("/" + uploadDir + filename);
            attachment.setUploadDate(LocalDateTime.now());
            attachmentRepository.save(attachment);
            return ResponseEntity.ok(toResponse(attachment));
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Failed to upload file");
        }
    }

    @GetMapping
    public ResponseEntity<List<CourseAttachmentResponse>> listAttachments(@PathVariable Long courseId) {
        List<CourseAttachment> attachments = attachmentRepository.findByCourseId(courseId);
        List<CourseAttachmentResponse> responses = attachments.stream().map(this::toResponse).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @DeleteMapping("/{attachmentId}")
    public ResponseEntity<?> deleteAttachment(@PathVariable Long courseId, @PathVariable Long attachmentId) {
        Optional<CourseAttachment> attachmentOpt = attachmentRepository.findById(attachmentId);
        if (attachmentOpt.isEmpty() || !attachmentOpt.get().getCourse().getId().equals(courseId)) {
            return ResponseEntity.status(404).body("Attachment not found for this course");
        }
        // Optionally delete the file from disk
        String fileUrl = attachmentOpt.get().getFileUrl();
        if (fileUrl != null && fileUrl.startsWith("/uploads/")) {
            File file = new File("." + fileUrl);
            if (file.exists()) file.delete();
        }
        attachmentRepository.deleteById(attachmentId);
        return ResponseEntity.ok("Attachment deleted");
    }

    private CourseAttachmentResponse toResponse(CourseAttachment attachment) {
        CourseAttachmentResponse resp = new CourseAttachmentResponse();
        resp.setId(attachment.getId());
        resp.setFileName(attachment.getFileName());
        resp.setFileType(attachment.getFileType());
        resp.setFileUrl(attachment.getFileUrl());
        resp.setUploadDate(attachment.getUploadDate());
        return resp;
    }
} 