package com.sikhshan.dto;

import java.time.LocalDateTime;

public class WebSocketMessage {
    
    private String type;
    private Object data;
    private Long chatRoomId;
    private Long senderId;
    private LocalDateTime timestamp;
    
    public enum MessageType {
        NEW_MESSAGE,
        MESSAGE_DELETED,
        USER_ONLINE,
        USER_OFFLINE,
        TYPING_START,
        TYPING_STOP,
        MESSAGE_READ
    }
    
    // Default constructor
    public WebSocketMessage() {
        this.timestamp = LocalDateTime.now();
    }
    
    // Constructor with type and data
    public WebSocketMessage(String type, Object data) {
        this();
        this.type = type;
        this.data = data;
    }
    
    // Constructor with all fields
    public WebSocketMessage(String type, Object data, Long chatRoomId, Long senderId) {
        this(type, data);
        this.chatRoomId = chatRoomId;
        this.senderId = senderId;
    }
    
    // Getters and Setters
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
        this.type = type;
    }
    
    public Object getData() {
        return data;
    }
    
    public void setData(Object data) {
        this.data = data;
    }
    
    public Long getChatRoomId() {
        return chatRoomId;
    }
    
    public void setChatRoomId(Long chatRoomId) {
        this.chatRoomId = chatRoomId;
    }
    
    public Long getSenderId() {
        return senderId;
    }
    
    public void setSenderId(Long senderId) {
        this.senderId = senderId;
    }
    
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
    
    // Static factory methods for common message types
    public static WebSocketMessage newMessage(MessageResponse message) {
        return new WebSocketMessage(MessageType.NEW_MESSAGE.name(), message, message.getChatRoomId(), message.getSender().getId());
    }
    
    public static WebSocketMessage messageDeleted(Long messageId, Long chatRoomId, Long senderId) {
        return new WebSocketMessage(MessageType.MESSAGE_DELETED.name(), messageId, chatRoomId, senderId);
    }
    
    public static WebSocketMessage userOnline(Long userId) {
        return new WebSocketMessage(MessageType.USER_ONLINE.name(), userId);
    }
    
    public static WebSocketMessage userOffline(Long userId) {
        return new WebSocketMessage(MessageType.USER_OFFLINE.name(), userId);
    }
    
    public static WebSocketMessage typingStart(Long chatRoomId, Long userId) {
        return new WebSocketMessage(MessageType.TYPING_START.name(), userId, chatRoomId, userId);
    }
    
    public static WebSocketMessage typingStop(Long chatRoomId, Long userId) {
        return new WebSocketMessage(MessageType.TYPING_STOP.name(), userId, chatRoomId, userId);
    }
    
    public static WebSocketMessage messageRead(Long chatRoomId, Long userId) {
        return new WebSocketMessage(MessageType.MESSAGE_READ.name(), userId, chatRoomId, userId);
    }
} 