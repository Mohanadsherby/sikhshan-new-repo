package com.sikhshan.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class MessageRequest {
    
    @NotNull(message = "Chat room ID is required")
    private Long chatRoomId;
    
    @NotBlank(message = "Message content is required")
    private String content;
    
    private String messageType = "TEXT";
    
    private String fileUrl;
    
    // Default constructor
    public MessageRequest() {}
    
    // Constructor with basic fields
    public MessageRequest(Long chatRoomId, String content) {
        this.chatRoomId = chatRoomId;
        this.content = content;
    }
    
    // Constructor with all fields
    public MessageRequest(Long chatRoomId, String content, String messageType, String fileUrl) {
        this.chatRoomId = chatRoomId;
        this.content = content;
        this.messageType = messageType;
        this.fileUrl = fileUrl;
    }
    
    // Getters and Setters
    public Long getChatRoomId() {
        return chatRoomId;
    }
    
    public void setChatRoomId(Long chatRoomId) {
        this.chatRoomId = chatRoomId;
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
} 