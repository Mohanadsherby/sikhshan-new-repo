package com.sikhshan.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "chat_room")
public class ChatRoom {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user1_id", nullable = false)
    private User user1;
    
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user2_id", nullable = false)
    private User user2;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "last_message_at", nullable = false)
    private LocalDateTime lastMessageAt;
    
    @OneToMany(mappedBy = "chatRoom", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Message> messages;
    
    // Default constructor
    public ChatRoom() {
        this.createdAt = LocalDateTime.now();
        this.lastMessageAt = LocalDateTime.now();
    }
    
    // Constructor with users
    public ChatRoom(User user1, User user2) {
        this();
        this.user1 = user1;
        this.user2 = user2;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public User getUser1() {
        return user1;
    }
    
    public void setUser1(User user1) {
        this.user1 = user1;
    }
    
    public User getUser2() {
        return user2;
    }
    
    public void setUser2(User user2) {
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
    
    public List<Message> getMessages() {
        return messages;
    }
    
    public void setMessages(List<Message> messages) {
        this.messages = messages;
    }
    
    // Helper method to get the other user in the chat
    public User getOtherUser(Long currentUserId) {
        if (user1.getId() == currentUserId) {
            return user2;
        } else if (user2.getId() == currentUserId) {
            return user1;
        }
        return null;
    }
    
    // Helper method to check if a user is part of this chat room
    public boolean containsUser(Long userId) {
        return user1.getId() == userId || user2.getId() == userId;
    }
} 