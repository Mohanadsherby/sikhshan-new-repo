package com.sikhshan.restcontroller;

import com.sikhshan.dto.CourseAttachmentResponse;
import com.sikhshan.model.Course;
import com.sikhshan.model.CourseAttachment;
import com.sikhshan.repository.CourseAttachmentRepository;
import com.sikhshan.repository.CourseRepository;
import com.sikhshan.service.CloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/courses/{courseId}/attachments")
public class CourseAttachmentController {
    @Autowired
    private CourseAttachmentRepository attachmentRepository;
    @Autowired
    private CourseRepository courseRepository;
    @Autowired
    private CloudinaryService cloudinaryService;

    @PostMapping
    public ResponseEntity<?> uploadAttachment(@PathVariable Long courseId, @RequestParam("file") MultipartFile file) {
        Optional<Course> courseOpt = courseRepository.findById(courseId);
        if (courseOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Course not found");
        }
        
        try {
            // Upload file to Cloudinary
            Map<String, Object> uploadResult = cloudinaryService.uploadCourseAttachment(file, courseId);
            
            // Create attachment record
            CourseAttachment attachment = new CourseAttachment();
            attachment.setCourse(courseOpt.get());
            attachment.setFileName(file.getOriginalFilename());
            attachment.setFileType(file.getContentType());
            attachment.setCloudinaryPublicId((String) uploadResult.get("public_id"));
            attachment.setCloudinaryUrl((String) uploadResult.get("secure_url"));
            attachment.setFileUrl((String) uploadResult.get("secure_url"));
            attachment.setUploadDate(LocalDateTime.now());
            
            attachmentRepository.save(attachment);
            return ResponseEntity.ok(toResponse(attachment));
            
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Failed to upload file: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<CourseAttachmentResponse>> listAttachments(@PathVariable Long courseId) {
        try {
            List<CourseAttachment> attachments = attachmentRepository.findByCourseId(courseId);
            List<CourseAttachmentResponse> responses = attachments.stream().map(this::toResponse).collect(Collectors.toList());
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            System.err.println("Error listing attachments for course " + courseId + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/{attachmentId}/download")
    public ResponseEntity<?> downloadAttachment(@PathVariable Long courseId, @PathVariable Long attachmentId) {
        Optional<CourseAttachment> attachmentOpt = attachmentRepository.findById(attachmentId);
        if (attachmentOpt.isEmpty() || !attachmentOpt.get().getCourse().getId().equals(courseId)) {
            return ResponseEntity.status(404).build();
        }
        
        CourseAttachment attachment = attachmentOpt.get();
        
        try {
            // Generate simple raw URL
            String downloadUrl = cloudinaryService.generateRawDownloadUrl(
                attachment.getCloudinaryPublicId(), 
                attachment.getFileName()
            );
            
            // Set headers to force download with proper filename
            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.LOCATION, downloadUrl);
            headers.add("Content-Disposition", "attachment; filename=\"" + attachment.getFileName() + "\"");
            headers.add("Content-Type", attachment.getFileType());
            
            return ResponseEntity.status(302).headers(headers).build();
                
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to generate download URL: " + e.getMessage());
        }
    }

    @DeleteMapping("/{attachmentId}")
    public ResponseEntity<?> deleteAttachment(@PathVariable Long courseId, @PathVariable Long attachmentId) {
        Optional<CourseAttachment> attachmentOpt = attachmentRepository.findById(attachmentId);
        if (attachmentOpt.isEmpty() || !attachmentOpt.get().getCourse().getId().equals(courseId)) {
            return ResponseEntity.status(404).body("Attachment not found for this course");
        }
        
        CourseAttachment attachment = attachmentOpt.get();
        
        // Delete file from Cloudinary if exists
        if (attachment.getCloudinaryPublicId() != null && !attachment.getCloudinaryPublicId().isEmpty()) {
            try {
                cloudinaryService.deleteFile(attachment.getCloudinaryPublicId());
            } catch (IOException e) {
                // Log error but continue with deletion
                System.err.println("Failed to delete attachment from Cloudinary: " + e.getMessage());
            }
        }
        
        attachmentRepository.deleteById(attachmentId);
        return ResponseEntity.ok("Attachment deleted");
    }

    private CourseAttachmentResponse toResponse(CourseAttachment attachment) {
        CourseAttachmentResponse resp = new CourseAttachmentResponse();
        resp.setId(attachment.getId());
        resp.setFileName(attachment.getFileName());
        resp.setFileType(attachment.getFileType());
        
        try {
            // Generate proper raw URL instead of using default secure_url
            String rawUrl = cloudinaryService.generateRawDownloadUrl(
                attachment.getCloudinaryPublicId(), 
                attachment.getFileName()
            );
            resp.setFileUrl(rawUrl);
        } catch (Exception e) {
            // Fallback to original URL if raw URL generation fails
            resp.setFileUrl(attachment.getFileUrl());
            System.err.println("Failed to generate raw URL for attachment " + attachment.getId() + ": " + e.getMessage());
        }
        
        resp.setUploadDate(attachment.getUploadDate());
        return resp;
    }
} 