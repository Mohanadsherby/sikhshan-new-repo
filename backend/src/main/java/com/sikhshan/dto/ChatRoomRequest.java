package com.sikhshan.dto;

import jakarta.validation.constraints.NotNull;

public class ChatRoomRequest {
    
    @NotNull(message = "User 1 ID is required")
    private Long user1Id;
    
    @NotNull(message = "User 2 ID is required")
    private Long user2Id;
    
    // Default constructor
    public ChatRoomRequest() {}
    
    // Constructor with fields
    public ChatRoomRequest(Long user1Id, Long user2Id) {
        this.user1Id = user1Id;
        this.user2Id = user2Id;
    }
    
    // Getters and Setters
    public Long getUser1Id() {
        return user1Id;
    }
    
    public void setUser1Id(Long user1Id) {
        this.user1Id = user1Id;
    }
    
    public Long getUser2Id() {
        return user2Id;
    }
    
    public void setUser2Id(Long user2Id) {
        this.user2Id = user2Id;
    }
} 