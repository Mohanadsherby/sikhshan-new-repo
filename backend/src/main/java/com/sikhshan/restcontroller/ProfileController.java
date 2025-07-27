package com.sikhshan.restcontroller;

import com.sikhshan.dto.ProfileRequest;
import com.sikhshan.dto.ProfileResponse;
import com.sikhshan.model.User;
import com.sikhshan.repository.UserRepository;
import com.sikhshan.service.CloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CloudinaryService cloudinaryService;

    // Get user's profile by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getProfile(@PathVariable Long id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        User user = userOpt.get();
        ProfileResponse response = toProfileResponse(user);
        return ResponseEntity.ok(response);
    }

    // Update user's profile by ID
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProfile(@PathVariable Long id, @RequestBody ProfileRequest request) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        User user = userOpt.get();
        user.setName(request.getName());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        user.setGender(request.getGender());
        user.setDateOfBirth(request.getDateOfBirth());
        user.setUpdatedAt(java.time.LocalDateTime.now());
        userRepository.save(user);
        return ResponseEntity.ok(toProfileResponse(user));
    }

    // Upload profile picture by ID
    @PostMapping("/{id}/picture")
    public ResponseEntity<?> uploadProfilePicture(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        User user = userOpt.get();
        
        try {
            // Delete old profile picture from Cloudinary if exists
            if (user.getCloudinaryPublicId() != null && !user.getCloudinaryPublicId().isEmpty()) {
                try {
                    cloudinaryService.deleteFile(user.getCloudinaryPublicId());
                } catch (IOException e) {
                    // Log error but continue with upload
                    System.err.println("Failed to delete old profile picture: " + e.getMessage());
                }
            }
            
            // Upload new profile picture to Cloudinary
            Map<String, Object> uploadResult = cloudinaryService.uploadProfilePicture(file, user.getId());
            
            // Update user with Cloudinary information
            user.setCloudinaryPublicId((String) uploadResult.get("public_id"));
            user.setCloudinaryUrl((String) uploadResult.get("secure_url"));
            user.setProfilePictureUrl((String) uploadResult.get("secure_url"));
            user.setUpdatedAt(java.time.LocalDateTime.now());
            
            userRepository.save(user);
            return ResponseEntity.ok(toProfileResponse(user));
            
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload image: " + e.getMessage());
        }
    }

    private ProfileResponse toProfileResponse(User user) {
        ProfileResponse resp = new ProfileResponse();
        resp.setName(user.getName());
        resp.setEmail(user.getEmail());
        resp.setPhone(user.getPhone());
        resp.setAddress(user.getAddress());
        resp.setGender(user.getGender());
        resp.setDateOfBirth(user.getDateOfBirth());
        resp.setProfilePictureUrl(user.getProfilePictureUrl());
        return resp;
    }
} 