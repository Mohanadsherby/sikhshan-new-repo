package com.sikhshan.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_status")
public class UserStatus {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;
    
    @Column(name = "is_online", nullable = false)
    private Boolean isOnline = false;
    
    @Column(name = "last_seen", nullable = false)
    private LocalDateTime lastSeen;
    
    // Default constructor
    public UserStatus() {
        this.lastSeen = LocalDateTime.now();
        this.isOnline = false;
    }
    
    // Constructor with user
    public UserStatus(User user) {
        this();
        this.user = user;
    }
    
    // Constructor with all fields
    public UserStatus(User user, Boolean isOnline, LocalDateTime lastSeen) {
        this.user = user;
        this.isOnline = isOnline;
        this.lastSeen = lastSeen;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public Boolean getIsOnline() {
        return isOnline;
    }
    
    public void setIsOnline(Boolean isOnline) {
        this.isOnline = isOnline;
    }
    
    public LocalDateTime getLastSeen() {
        return lastSeen;
    }
    
    public void setLastSeen(LocalDateTime lastSeen) {
        this.lastSeen = lastSeen;
    }
    
    // Helper method to mark user as online
    public void markOnline() {
        this.isOnline = true;
        this.lastSeen = LocalDateTime.now();
    }
    
    // Helper method to mark user as offline
    public void markOffline() {
        this.isOnline = false;
        this.lastSeen = LocalDateTime.now();
    }
    
    // Helper method to update last seen
    public void updateLastSeen() {
        this.lastSeen = LocalDateTime.now();
    }
} 