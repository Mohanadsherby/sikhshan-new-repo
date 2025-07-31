package com.sikhshan.dto;

import jakarta.validation.constraints.NotNull;

public class DeleteMessageRequest {
    
    @NotNull(message = "Message ID is required")
    private Long messageId;
    
    @NotNull(message = "User ID is required")
    private Long userId;
    
    // Default constructor
    public DeleteMessageRequest() {}
    
    // Constructor with fields
    public DeleteMessageRequest(Long messageId, Long userId) {
        this.messageId = messageId;
        this.userId = userId;
    }
    
    // Getters and Setters
    public Long getMessageId() {
        return messageId;
    }
    
    public void setMessageId(Long messageId) {
        this.messageId = messageId;
    }
    
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
} 