package com.sikhshan.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

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
            "transformation", "w_300,h_300,c_fill,g_face"
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
            "transformation", "w_800,h_600,c_fill"
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
        Map<String, Object> uploadParams = ObjectUtils.asMap(
            "folder", "sikhshan/course-attachments",
            "public_id", "course_" + courseId + "_attachment_" + System.currentTimeMillis(),
            "overwrite", true,
            "resource_type", "auto"
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
} 