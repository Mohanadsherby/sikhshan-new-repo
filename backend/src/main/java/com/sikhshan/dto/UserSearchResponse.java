package com.sikhshan.dto;

import java.util.List;

public class UserSearchResponse {
    
    private List<UserInfo> users;
    private List<UserInfo> suggestedUsers;
    private Integer totalElements;
    private Integer totalPages;
    private Integer currentPage;
    private Integer size;
    
    // Default constructor
    public UserSearchResponse() {}
    
    // Constructor with basic fields
    public UserSearchResponse(List<UserInfo> users, List<UserInfo> suggestedUsers) {
        this.users = users;
        this.suggestedUsers = suggestedUsers;
    }
    
    // Constructor with all fields
    public UserSearchResponse(List<UserInfo> users, List<UserInfo> suggestedUsers, 
                            Integer totalElements, Integer totalPages, Integer currentPage, Integer size) {
        this.users = users;
        this.suggestedUsers = suggestedUsers;
        this.totalElements = totalElements;
        this.totalPages = totalPages;
        this.currentPage = currentPage;
        this.size = size;
    }
    
    // Getters and Setters
    public List<UserInfo> getUsers() {
        return users;
    }
    
    public void setUsers(List<UserInfo> users) {
        this.users = users;
    }
    
    public List<UserInfo> getSuggestedUsers() {
        return suggestedUsers;
    }
    
    public void setSuggestedUsers(List<UserInfo> suggestedUsers) {
        this.suggestedUsers = suggestedUsers;
    }
    
    public Integer getTotalElements() {
        return totalElements;
    }
    
    public void setTotalElements(Integer totalElements) {
        this.totalElements = totalElements;
    }
    
    public Integer getTotalPages() {
        return totalPages;
    }
    
    public void setTotalPages(Integer totalPages) {
        this.totalPages = totalPages;
    }
    
    public Integer getCurrentPage() {
        return currentPage;
    }
    
    public void setCurrentPage(Integer currentPage) {
        this.currentPage = currentPage;
    }
    
    public Integer getSize() {
        return size;
    }
    
    public void setSize(Integer size) {
        this.size = size;
    }
    
    // Inner class for user information
    public static class UserInfo {
        private Long id;
        private String name;
        private String email;
        private String profilePictureUrl;
        private String role;
        private Boolean isOnline;
        private String lastSeen;
        
        public UserInfo() {}
        
        public UserInfo(Long id, String name, String email, String profilePictureUrl, String role, Boolean isOnline) {
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
        
        public String getLastSeen() {
            return lastSeen;
        }
        
        public void setLastSeen(String lastSeen) {
            this.lastSeen = lastSeen;
        }
        
        // Helper method to get display name (name or email if name is null)
        public String getDisplayName() {
            return name != null && !name.trim().isEmpty() ? name : email;
        }
    }
} 