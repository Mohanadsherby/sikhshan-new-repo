package com.sikhshan.dto;

import java.time.LocalDateTime;

public class AuditLogResponse {
    private Long id;
    private LocalDateTime timestamp;
    private Long userId;
    private String username;
    private String action;
    private String details;
    private String status;
    private String ipAddress;
    private String userAgent;
    private String resourceType;
    private Long resourceId;
    private String oldValues;
    private String newValues;
    private String sessionId;
    private String requestMethod;
    private String requestUrl;
    private Integer responseStatus;
    private Long executionTime;
    private String errorMessage;
    
    // Computed fields for display
    private String formattedTimestamp;
    private String statusColor;
    private String actionDisplay;
    private String durationDisplay;
    
    // Constructors
    public AuditLogResponse() {}
    
    public AuditLogResponse(Long id, LocalDateTime timestamp, Long userId, String username, 
                           String action, String details, String status, String ipAddress) {
        this.id = id;
        this.timestamp = timestamp;
        this.userId = userId;
        this.username = username;
        this.action = action;
        this.details = details;
        this.status = status;
        this.ipAddress = ipAddress;
        this.formattedTimestamp = timestamp.toString();
        this.statusColor = getStatusColor(status);
        this.actionDisplay = getActionDisplay(action);
    }
    
    // Helper methods for computed fields
    private String getStatusColor(String status) {
        switch (status != null ? status.toUpperCase() : "") {
            case "SUCCESS":
                return "text-green-500";
            case "ERROR":
                return "text-red-500";
            case "WARNING":
                return "text-yellow-500";
            case "INFO":
                return "text-blue-500";
            default:
                return "text-gray-500";
        }
    }
    
    private String getActionDisplay(String action) {
        if (action == null) return "Unknown";
        
        switch (action.toUpperCase()) {
            case "LOGIN":
                return "User Login";
            case "LOGOUT":
                return "User Logout";
            case "CREATE_USER":
                return "Create User";
            case "UPDATE_USER":
                return "Update User";
            case "DELETE_USER":
                return "Delete User";
            case "CREATE_COURSE":
                return "Create Course";
            case "UPDATE_COURSE":
                return "Update Course";
            case "DELETE_COURSE":
                return "Delete Course";
            case "CREATE_ASSIGNMENT":
                return "Create Assignment";
            case "UPDATE_ASSIGNMENT":
                return "Update Assignment";
            case "DELETE_ASSIGNMENT":
                return "Delete Assignment";
            case "CREATE_QUIZ":
                return "Create Quiz";
            case "UPDATE_QUIZ":
                return "Update Quiz";
            case "DELETE_QUIZ":
                return "Delete Quiz";
            case "SUBMIT_ASSIGNMENT":
                return "Submit Assignment";
            case "GRADE_ASSIGNMENT":
                return "Grade Assignment";
            case "TAKE_QUIZ":
                return "Take Quiz";
            case "GRADE_QUIZ":
                return "Grade Quiz";
            case "ENROLL_COURSE":
                return "Enroll in Course";
            case "UNENROLL_COURSE":
                return "Unenroll from Course";
            case "UPLOAD_FILE":
                return "Upload File";
            case "DELETE_FILE":
                return "Delete File";
            case "SYSTEM_BACKUP":
                return "System Backup";
            case "SYSTEM_RESTORE":
                return "System Restore";
            case "PASSWORD_CHANGE":
                return "Password Change";
            case "PROFILE_UPDATE":
                return "Profile Update";
            default:
                return action.replace("_", " ").toLowerCase();
        }
    }
    
    private String getDurationDisplay(Long executionTime) {
        if (executionTime == null) return "N/A";
        
        if (executionTime < 1000) {
            return executionTime + "ms";
        } else if (executionTime < 60000) {
            return String.format("%.1fs", executionTime / 1000.0);
        } else {
            return String.format("%.1fm", executionTime / 60000.0);
        }
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
        this.formattedTimestamp = timestamp != null ? timestamp.toString() : "";
    }
    
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getAction() {
        return action;
    }
    
    public void setAction(String action) {
        this.action = action;
        this.actionDisplay = getActionDisplay(action);
    }
    
    public String getDetails() {
        return details;
    }
    
    public void setDetails(String details) {
        this.details = details;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
        this.statusColor = getStatusColor(status);
    }
    
    public String getIpAddress() {
        return ipAddress;
    }
    
    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }
    
    public String getUserAgent() {
        return userAgent;
    }
    
    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
    }
    
    public String getResourceType() {
        return resourceType;
    }
    
    public void setResourceType(String resourceType) {
        this.resourceType = resourceType;
    }
    
    public Long getResourceId() {
        return resourceId;
    }
    
    public void setResourceId(Long resourceId) {
        this.resourceId = resourceId;
    }
    
    public String getOldValues() {
        return oldValues;
    }
    
    public void setOldValues(String oldValues) {
        this.oldValues = oldValues;
    }
    
    public String getNewValues() {
        return newValues;
    }
    
    public void setNewValues(String newValues) {
        this.newValues = newValues;
    }
    
    public String getSessionId() {
        return sessionId;
    }
    
    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }
    
    public String getRequestMethod() {
        return requestMethod;
    }
    
    public void setRequestMethod(String requestMethod) {
        this.requestMethod = requestMethod;
    }
    
    public String getRequestUrl() {
        return requestUrl;
    }
    
    public void setRequestUrl(String requestUrl) {
        this.requestUrl = requestUrl;
    }
    
    public Integer getResponseStatus() {
        return responseStatus;
    }
    
    public void setResponseStatus(Integer responseStatus) {
        this.responseStatus = responseStatus;
    }
    
    public Long getExecutionTime() {
        return executionTime;
    }
    
    public void setExecutionTime(Long executionTime) {
        this.executionTime = executionTime;
        this.durationDisplay = getDurationDisplay(executionTime);
    }
    
    public String getErrorMessage() {
        return errorMessage;
    }
    
    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }
    
    public String getFormattedTimestamp() {
        return formattedTimestamp;
    }
    
    public void setFormattedTimestamp(String formattedTimestamp) {
        this.formattedTimestamp = formattedTimestamp;
    }
    
    public String getStatusColor() {
        return statusColor;
    }
    
    public void setStatusColor(String statusColor) {
        this.statusColor = statusColor;
    }
    
    public String getActionDisplay() {
        return actionDisplay;
    }
    
    public void setActionDisplay(String actionDisplay) {
        this.actionDisplay = actionDisplay;
    }
    
    public String getDurationDisplay() {
        return durationDisplay;
    }
    
    public void setDurationDisplay(String durationDisplay) {
        this.durationDisplay = durationDisplay;
    }
} 