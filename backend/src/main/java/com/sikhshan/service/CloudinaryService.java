package com.sikhshan.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import com.cloudinary.Transformation;

@Service
public class CloudinaryService {
    
    @Autowired
    private Cloudinary cloudinary;
    
    /**
     * Upload profile picture to Cloudinary
     * @param file The image file to upload
     * @param userId The user ID for organizing files
     * @return Map containing upload result with public_id and url
     */
    public Map<String, Object> uploadProfilePicture(MultipartFile file, Long userId) throws IOException {
        Map<String, Object> uploadParams = ObjectUtils.asMap(
            "folder", "sikhshan/profile-pictures",
            "public_id", "user_" + userId + "_" + System.currentTimeMillis(),
            "overwrite", true,
            "resource_type", "image",
            "transformation", "w_300,h_300,c_fill,g_face",
            "access_mode", "public" // Make files publicly accessible
        );
        
        return cloudinary.uploader().upload(file.getBytes(), uploadParams);
    }
    
    /**
     * Upload course image to Cloudinary
     * @param file The image file to upload
     * @param courseId The course ID for organizing files
     * @return Map containing upload result with public_id and url
     */
    public Map<String, Object> uploadCourseImage(MultipartFile file, Long courseId) throws IOException {
        Map<String, Object> uploadParams = ObjectUtils.asMap(
            "folder", "sikhshan/course-images",
            "public_id", "course_" + courseId + "_" + System.currentTimeMillis(),
            "overwrite", true,
            "resource_type", "image",
            "transformation", "w_800,h_600,c_fill",
            "access_mode", "public" // Make files publicly accessible
        );
        
        return cloudinary.uploader().upload(file.getBytes(), uploadParams);
    }
    
    /**
     * Upload course attachment to Cloudinary
     * @param file The file to upload
     * @param courseId The course ID for organizing files
     * @return Map containing upload result with public_id and url
     */
    public Map<String, Object> uploadCourseAttachment(MultipartFile file, Long courseId) throws IOException {
        // Check file size (10MB limit for Cloudinary free tier)
        long maxSize = 10 * 1024 * 1024; // 10MB in bytes
        if (file.getSize() > maxSize) {
            throw new IOException("File size too large. Got " + file.getSize() + ". Maximum is " + maxSize + ". Upgrade your plan to enjoy higher limits https://www.cloudinary.com/pricing/upgrades/file-limit");
        }

        // Get original filename and sanitize it
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.isEmpty()) {
            originalFilename = "unnamed_file";
        }
        
        // Sanitize filename: remove special characters, keep alphanumeric, dots, hyphens, underscores
        String sanitizedFilename = originalFilename.replaceAll("[^a-zA-Z0-9._-]", "_");
        
        // Add timestamp to ensure uniqueness
        String timestamp = String.valueOf(System.currentTimeMillis());
        String filenameWithoutExt = sanitizedFilename;
        String fileExtension = "";
        
        // Extract file extension
        int lastDotIndex = sanitizedFilename.lastIndexOf('.');
        if (lastDotIndex > 0) {
            filenameWithoutExt = sanitizedFilename.substring(0, lastDotIndex);
            fileExtension = sanitizedFilename.substring(lastDotIndex);
        }
        
        // Create unique public_id with original filename
        String publicId = "sikhshan/course-attachments/course_" + courseId + "/" + 
                         filenameWithoutExt + "_" + timestamp + fileExtension;
        
        Map<String, Object> uploadParams = ObjectUtils.asMap(
            "public_id", publicId,
            "overwrite", false, // Don't overwrite to preserve unique filenames
            "resource_type", "raw", // Force all files to be treated as raw files
            "use_filename", true, // Use original filename
            "unique_filename", true, // Ensure unique filenames
            "access_mode", "public" // Make files publicly accessible
        );
        
        return cloudinary.uploader().upload(file.getBytes(), uploadParams);
    }
    
    /**
     * Delete file from Cloudinary
     * @param publicId The public ID of the file to delete
     * @return Map containing deletion result
     */
    public Map<String, Object> deleteFile(String publicId) throws IOException {
        return cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
    }

    /**
     * Generate a proper raw download URL for files
     * @param publicId The public ID of the file
     * @param originalFilename The original filename
     * @return Proper raw URL for downloading
     */
    public String generateRawDownloadUrl(String publicId, String originalFilename) {
        try {
            // Generate simple raw URL that works
            return cloudinary.url()
                .resourceType("raw")
                .generate(publicId);
        } catch (Exception e) {
            // Fallback to simple raw URL if transformation fails
            return cloudinary.url().resourceType("raw").generate(publicId);
        }
    }
} 