package com.sikhshan.dto;

public class UserSearchRequest {
    
    private String query;
    private String role;
    private Long currentUserId;
    private Integer page = 0;
    private Integer size = 20;
    
    // Default constructor
    public UserSearchRequest() {}
    
    // Constructor with basic fields
    public UserSearchRequest(String query, String role, Long currentUserId) {
        this.query = query;
        this.role = role;
        this.currentUserId = currentUserId;
    }
    
    // Constructor with all fields
    public UserSearchRequest(String query, String role, Long currentUserId, Integer page, Integer size) {
        this.query = query;
        this.role = role;
        this.currentUserId = currentUserId;
        this.page = page;
        this.size = size;
    }
    
    // Getters and Setters
    public String getQuery() {
        return query;
    }
    
    public void setQuery(String query) {
        this.query = query;
    }
    
    public String getRole() {
        return role;
    }
    
    public void setRole(String role) {
        this.role = role;
    }
    
    public Long getCurrentUserId() {
        return currentUserId;
    }
    
    public void setCurrentUserId(Long currentUserId) {
        this.currentUserId = currentUserId;
    }
    
    public Integer getPage() {
        return page;
    }
    
    public void setPage(Integer page) {
        this.page = page;
    }
    
    public Integer getSize() {
        return size;
    }
    
    public void setSize(Integer size) {
        this.size = size;
    }
} 