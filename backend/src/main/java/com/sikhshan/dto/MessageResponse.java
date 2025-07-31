package com.sikhshan.dto;

import java.time.LocalDateTime;

public class MessageResponse {
    
    private Long id;
    private Long chatRoomId;
    private SenderInfo sender;
    private String content;
    private String messageType;
    private String fileUrl;
    private LocalDateTime createdAt;
    private Boolean isRead;
    private Boolean isDeleted;
    private LocalDateTime deletedAt;
    private SenderInfo deletedBy;
    
    // Default constructor
    public MessageResponse() {}
    
    // Constructor with basic fields
    public MessageResponse(Long id, Long chatRoomId, SenderInfo sender, String content, LocalDateTime createdAt) {
        this.id = id;
        this.chatRoomId = chatRoomId;
        this.sender = sender;
        this.content = content;
        this.createdAt = createdAt;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getChatRoomId() {
        return chatRoomId;
    }
    
    public void setChatRoomId(Long chatRoomId) {
        this.chatRoomId = chatRoomId;
    }
    
    public SenderInfo getSender() {
        return sender;
    }
    
    public void setSender(SenderInfo sender) {
        this.sender = sender;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public String getMessageType() {
        return messageType;
    }
    
    public void setMessageType(String messageType) {
        this.messageType = messageType;
    }
    
    public String getFileUrl() {
        return fileUrl;
    }
    
    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public Boolean getIsRead() {
        return isRead;
    }
    
    public void setIsRead(Boolean isRead) {
        this.isRead = isRead;
    }
    
    public Boolean getIsDeleted() {
        return isDeleted;
    }
    
    public void setIsDeleted(Boolean isDeleted) {
        this.isDeleted = isDeleted;
    }
    
    public LocalDateTime getDeletedAt() {
        return deletedAt;
    }
    
    public void setDeletedAt(LocalDateTime deletedAt) {
        this.deletedAt = deletedAt;
    }
    
    public SenderInfo getDeletedBy() {
        return deletedBy;
    }
    
    public void setDeletedBy(SenderInfo deletedBy) {
        this.deletedBy = deletedBy;
    }
    
    // Inner class for sender information
    public static class SenderInfo {
        private Long id;
        private String name;
        private String email;
        private String profilePictureUrl;
        private String role;
        
        public SenderInfo() {}
        
        public SenderInfo(Long id, String name, String email, String profilePictureUrl, String role) {
            this.id = id;
            this.name = name;
            this.email = email;
            this.profilePictureUrl = profilePictureUrl;
            this.role = role;
        }
        
        // Getters and Setters
        public Long getId() {
            return id;
        }
        
        public void setId(Long id) {
            this.id = id;
        }
        
        public String getName() {
            return name;
        }
        
        public void setName(String name) {
            this.name = name;
        }
        
        public String getEmail() {
            return email;
        }
        
        public void setEmail(String email) {
            this.email = email;
        }
        
        public String getProfilePictureUrl() {
            return profilePictureUrl;
        }
        
        public void setProfilePictureUrl(String profilePictureUrl) {
            this.profilePictureUrl = profilePictureUrl;
        }
        
        public String getRole() {
            return role;
        }
        
        public void setRole(String role) {
            this.role = role;
        }
    }
} 