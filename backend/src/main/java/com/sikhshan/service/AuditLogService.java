package com.sikhshan.service;

import com.sikhshan.model.AuditLog;
import com.sikhshan.model.User;
import com.sikhshan.repository.AuditLogRepository;
import com.sikhshan.dto.AuditLogResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AuditLogService {
    
    @Autowired
    private AuditLogRepository auditLogRepository;
    
    /**
     * Create a new audit log entry
     */
    public AuditLog createLog(User user, String action, String details, String status) {
        AuditLog auditLog = new AuditLog(user, action, details, status);
        return auditLogRepository.save(auditLog);
    }
    
    /**
     * Create a new audit log entry with additional details
     */
    public AuditLog createLog(User user, String action, String details, String status, 
                             String ipAddress, String userAgent, String resourceType, Long resourceId) {
        AuditLog auditLog = new AuditLog(user, action, details, status);
        auditLog.setIpAddress(ipAddress);
        auditLog.setUserAgent(userAgent);
        auditLog.setResourceType(resourceType);
        auditLog.setResourceId(resourceId);
        return auditLogRepository.save(auditLog);
    }
    
    /**
     * Create a comprehensive audit log entry
     */
    public AuditLog createLog(User user, String action, String details, String status,
                             String ipAddress, String userAgent, String resourceType, Long resourceId,
                             String oldValues, String newValues, String sessionId, String requestMethod,
                             String requestUrl, Integer responseStatus, Long executionTime, String errorMessage) {
        AuditLog auditLog = new AuditLog(user, action, details, status);
        auditLog.setIpAddress(ipAddress);
        auditLog.setUserAgent(userAgent);
        auditLog.setResourceType(resourceType);
        auditLog.setResourceId(resourceId);
        auditLog.setOldValues(oldValues);
        auditLog.setNewValues(newValues);
        auditLog.setSessionId(sessionId);
        auditLog.setRequestMethod(requestMethod);
        auditLog.setRequestUrl(requestUrl);
        auditLog.setResponseStatus(responseStatus);
        auditLog.setExecutionTime(executionTime);
        auditLog.setErrorMessage(errorMessage);
        return auditLogRepository.save(auditLog);
    }
    
    /**
     * Get all audit logs with pagination
     */
    public Page<AuditLogResponse> getAllLogs(Pageable pageable) {
        try {
            Page<AuditLog> logs = auditLogRepository.findAll(pageable);
            return logs.map(this::convertToResponse);
        } catch (Exception e) {
            System.err.println("Error fetching all logs: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    /**
     * Get audit logs with filters
     */
    public Page<AuditLogResponse> getLogsWithFilters(String username, String action, String status,
                                                    String resourceType, LocalDateTime startDate,
                                                    LocalDateTime endDate, String searchTerm, Pageable pageable) {
        try {
            Page<AuditLog> logs = auditLogRepository.findWithFilters(
                username, action, status, resourceType, startDate, endDate, searchTerm, pageable
            );
            return logs.map(this::convertToResponse);
        } catch (Exception e) {
            System.err.println("Error fetching logs with filters: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    /**
     * Get logs by user
     */
    public List<AuditLogResponse> getLogsByUser(Long userId) {
        List<AuditLog> logs = auditLogRepository.findByUserIdOrderByTimestampDesc(userId);
        return logs.stream().map(this::convertToResponse).collect(Collectors.toList());
    }
    
    /**
     * Get logs by action
     */
    public List<AuditLogResponse> getLogsByAction(String action) {
        List<AuditLog> logs = auditLogRepository.findByActionOrderByTimestampDesc(action);
        return logs.stream().map(this::convertToResponse).collect(Collectors.toList());
    }
    
    /**
     * Get logs by status
     */
    public List<AuditLogResponse> getLogsByStatus(String status) {
        List<AuditLog> logs = auditLogRepository.findByStatusOrderByTimestampDesc(status);
        return logs.stream().map(this::convertToResponse).collect(Collectors.toList());
    }
    
    /**
     * Get logs by date range
     */
    public List<AuditLogResponse> getLogsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        List<AuditLog> logs = auditLogRepository.findByTimestampBetweenOrderByTimestampDesc(startDate, endDate);
        return logs.stream().map(this::convertToResponse).collect(Collectors.toList());
    }
    
    /**
     * Get recent logs (last 24 hours)
     */
    public List<AuditLogResponse> getRecentLogs() {
        LocalDateTime startDate = LocalDateTime.now().minusHours(24);
        List<AuditLog> logs = auditLogRepository.findRecentLogs(startDate);
        return logs.stream().map(this::convertToResponse).collect(Collectors.toList());
    }
    
    /**
     * Get error logs
     */
    public List<AuditLogResponse> getErrorLogs() {
        List<AuditLog> logs = auditLogRepository.findByStatusOrderByTimestampDesc("ERROR");
        return logs.stream().map(this::convertToResponse).collect(Collectors.toList());
    }
    
    /**
     * Get failed requests (4xx and 5xx status codes)
     */
    public List<AuditLogResponse> getFailedRequests() {
        List<AuditLog> logs = auditLogRepository.findFailedRequests();
        return logs.stream().map(this::convertToResponse).collect(Collectors.toList());
    }
    
    /**
     * Get slow queries (execution time > threshold)
     */
    public List<AuditLogResponse> getSlowQueries(Long threshold) {
        List<AuditLog> logs = auditLogRepository.findSlowQueries(threshold);
        return logs.stream().map(this::convertToResponse).collect(Collectors.toList());
    }
    
    /**
     * Get logs by IP address
     */
    public List<AuditLogResponse> getLogsByIpAddress(String ipAddress) {
        List<AuditLog> logs = auditLogRepository.findByIpAddressOrderByTimestampDesc(ipAddress);
        return logs.stream().map(this::convertToResponse).collect(Collectors.toList());
    }
    
    /**
     * Get logs by session ID
     */
    public List<AuditLogResponse> getLogsBySessionId(String sessionId) {
        List<AuditLog> logs = auditLogRepository.findBySessionIdOrderByTimestampDesc(sessionId);
        return logs.stream().map(this::convertToResponse).collect(Collectors.toList());
    }
    
    /**
     * Search logs by username
     */
    public List<AuditLogResponse> searchLogsByUsername(String username) {
        List<AuditLog> logs = auditLogRepository.findByUsernameContainingIgnoreCase(username);
        return logs.stream().map(this::convertToResponse).collect(Collectors.toList());
    }
    
    /**
     * Search logs by details
     */
    public List<AuditLogResponse> searchLogsByDetails(String details) {
        List<AuditLog> logs = auditLogRepository.findByDetailsContainingIgnoreCase(details);
        return logs.stream().map(this::convertToResponse).collect(Collectors.toList());
    }
    
    /**
     * Get log statistics
     */
    public Map<String, Object> getLogStatistics() {
        try {
            Map<String, Object> stats = new java.util.HashMap<>();
            
            // Count by action
            List<Object[]> actionCounts = auditLogRepository.getLogCountByAction();
            Map<String, Long> actionStats = actionCounts.stream()
                .collect(Collectors.toMap(
                    row -> (String) row[0],
                    row -> (Long) row[1]
                ));
            stats.put("actionCounts", actionStats);
            
            // Count by status
            List<Object[]> statusCounts = auditLogRepository.getLogCountByStatus();
            Map<String, Long> statusStats = statusCounts.stream()
                .collect(Collectors.toMap(
                    row -> (String) row[0],
                    row -> (Long) row[1]
                ));
            stats.put("statusCounts", statusStats);
            
            // Count by user
            List<Object[]> userCounts = auditLogRepository.getLogCountByUser();
            Map<String, Long> userStats = userCounts.stream()
                .collect(Collectors.toMap(
                    row -> (String) row[0],
                    row -> (Long) row[1]
                ));
            stats.put("userCounts", userStats);
            
            // Count by date (last 7 days)
            List<Object[]> dateCounts = auditLogRepository.getLogCountByDate();
            Map<String, Long> dateStats = dateCounts.stream()
                .limit(7)
                .collect(Collectors.toMap(
                    row -> row[0].toString(),
                    row -> (Long) row[1]
                ));
            stats.put("dateCounts", dateStats);
            
            // Total logs
            long totalLogs = auditLogRepository.count();
            stats.put("totalLogs", totalLogs);
            
            // Recent logs count (last 24 hours)
            LocalDateTime startDate = LocalDateTime.now().minusHours(24);
            List<AuditLog> recentLogs = auditLogRepository.findRecentLogs(startDate);
            stats.put("recentLogsCount", recentLogs.size());
            
            // Error logs count
            List<AuditLog> errorLogs = auditLogRepository.findByStatusOrderByTimestampDesc("ERROR");
            stats.put("errorLogsCount", errorLogs.size());
            
            return stats;
        } catch (Exception e) {
            System.err.println("Error fetching log statistics: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    /**
     * Get audit log by ID
     */
    public AuditLogResponse getLogById(Long id) {
        try {
            AuditLog auditLog = auditLogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Audit log not found with id: " + id));
            return convertToResponse(auditLog);
        } catch (Exception e) {
            System.err.println("Error fetching audit log by ID: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    /**
     * Delete old logs (older than specified days)
     */
    public void deleteOldLogs(int days) {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(days);
        List<AuditLog> oldLogs = auditLogRepository.findByTimestampBetweenOrderByTimestampDesc(
            LocalDateTime.MIN, cutoffDate
        );
        auditLogRepository.deleteAll(oldLogs);
    }
    
    /**
     * Convert AuditLog entity to AuditLogResponse DTO
     */
    private AuditLogResponse convertToResponse(AuditLog auditLog) {
        AuditLogResponse response = new AuditLogResponse();
        response.setId(auditLog.getId());
        response.setTimestamp(auditLog.getTimestamp());
        response.setUserId(auditLog.getUser() != null ? auditLog.getUser().getId() : null);
        response.setUsername(auditLog.getUsername());
        response.setAction(auditLog.getAction());
        response.setDetails(auditLog.getDetails());
        response.setStatus(auditLog.getStatus());
        response.setIpAddress(auditLog.getIpAddress());
        response.setUserAgent(auditLog.getUserAgent());
        response.setResourceType(auditLog.getResourceType());
        response.setResourceId(auditLog.getResourceId());
        response.setOldValues(auditLog.getOldValues());
        response.setNewValues(auditLog.getNewValues());
        response.setSessionId(auditLog.getSessionId());
        response.setRequestMethod(auditLog.getRequestMethod());
        response.setRequestUrl(auditLog.getRequestUrl());
        response.setResponseStatus(auditLog.getResponseStatus());
        response.setExecutionTime(auditLog.getExecutionTime());
        response.setErrorMessage(auditLog.getErrorMessage());
        return response;
    }
} 