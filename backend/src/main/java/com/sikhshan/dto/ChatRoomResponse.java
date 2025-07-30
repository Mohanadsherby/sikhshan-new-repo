package com.sikhshan.dto;

import java.time.LocalDateTime;

public class ChatRoomResponse {
    
    private Long id;
    private UserSummary user1;
    private UserSummary user2;
    private LocalDateTime createdAt;
    private LocalDateTime lastMessageAt;
    private MessageSummary lastMessage;
    private Long unreadCount;
    
    // Default constructor
    public ChatRoomResponse() {}
    
    // Constructor with basic fields
    public ChatRoomResponse(Long id, UserSummary user1, UserSummary user2, LocalDateTime createdAt, LocalDateTime lastMessageAt) {
        this.id = id;
        this.user1 = user1;
        this.user2 = user2;
        this.createdAt = createdAt;
        this.lastMessageAt = lastMessageAt;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public UserSummary getUser1() {
        return user1;
    }
    
    public void setUser1(UserSummary user1) {
        this.user1 = user1;
    }
    
    public UserSummary getUser2() {
        return user2;
    }
    
    public void setUser2(UserSummary user2) {
        this.user2 = user2;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getLastMessageAt() {
        return lastMessageAt;
    }
    
    public void setLastMessageAt(LocalDateTime lastMessageAt) {
        this.lastMessageAt = lastMessageAt;
    }
    
    public MessageSummary getLastMessage() {
        return lastMessage;
    }
    
    public void setLastMessage(MessageSummary lastMessage) {
        this.lastMessage = lastMessage;
    }
    
    public Long getUnreadCount() {
        return unreadCount;
    }
    
    public void setUnreadCount(Long unreadCount) {
        this.unreadCount = unreadCount;
    }
    
    // Inner class for user summary
    public static class UserSummary {
        private Long id;
        private String name;
        private String email;
        private String profilePictureUrl;
        private String role;
        private Boolean isOnline;
        
        public UserSummary() {}
        
        public UserSummary(Long id, String name, String email, String profilePictureUrl, String role, Boolean isOnline) {
            this.id = id;
            this.name = name;
            this.email = email;
            this.profilePictureUrl = profilePictureUrl;
            this.role = role;
            this.isOnline = isOnline;
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
        
        public Boolean getIsOnline() {
            return isOnline;
        }
        
        public void setIsOnline(Boolean isOnline) {
            this.isOnline = isOnline;
        }
    }
    
    // Inner class for message summary
    public static class MessageSummary {
        private Long id;
        private String content;
        private String senderName;
        private LocalDateTime createdAt;
        private Boolean isDeleted;
        
        public MessageSummary() {}
        
        public MessageSummary(Long id, String content, String senderName, LocalDateTime createdAt, Boolean isDeleted) {
            this.id = id;
            this.content = content;
            this.senderName = senderName;
            this.createdAt = createdAt;
            this.isDeleted = isDeleted;
        }
        
        // Getters and Setters
        public Long getId() {
            return id;
        }
        
        public void setId(Long id) {
            this.id = id;
        }
        
        public String getContent() {
            return content;
        }
        
        public void setContent(String content) {
            this.content = content;
        }
        
        public String getSenderName() {
            return senderName;
        }
        
        public void setSenderName(String senderName) {
            this.senderName = senderName;
        }
        
        public LocalDateTime getCreatedAt() {
            return createdAt;
        }
        
        public void setCreatedAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
        }
        
        public Boolean getIsDeleted() {
            return isDeleted;
        }
        
        public void setIsDeleted(Boolean isDeleted) {
            this.isDeleted = isDeleted;
        }
    }
} 