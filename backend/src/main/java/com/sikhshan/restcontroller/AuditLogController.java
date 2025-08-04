package com.sikhshan.restcontroller;

import com.sikhshan.service.AuditLogService;
import com.sikhshan.dto.AuditLogResponse;
import com.sikhshan.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/audit-logs")
@CrossOrigin(origins = "*")
public class AuditLogController {
    
    @Autowired
    private AuditLogService auditLogService;
    
    /**
     * Get all audit logs with pagination
     */
    @GetMapping
    public ResponseEntity<Page<AuditLogResponse>> getAllLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "timestamp") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<AuditLogResponse> logs = auditLogService.getAllLogs(pageable);
        return ResponseEntity.ok(logs);
    }
    
    /**
     * Get audit logs with filters
     */
    @GetMapping("/filter")
    public ResponseEntity<Page<AuditLogResponse>> getLogsWithFilters(
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String resourceType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(required = false) String searchTerm,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("timestamp").descending());
        Page<AuditLogResponse> logs = auditLogService.getLogsWithFilters(
            username, action, status, resourceType, startDate, endDate, searchTerm, pageable
        );
        return ResponseEntity.ok(logs);
    }
    
    /**
     * Get logs by user ID
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AuditLogResponse>> getLogsByUser(@PathVariable Long userId) {
        List<AuditLogResponse> logs = auditLogService.getLogsByUser(userId);
        return ResponseEntity.ok(logs);
    }
    
    /**
     * Get logs by action
     */
    @GetMapping("/action/{action}")
    public ResponseEntity<List<AuditLogResponse>> getLogsByAction(@PathVariable String action) {
        List<AuditLogResponse> logs = auditLogService.getLogsByAction(action);
        return ResponseEntity.ok(logs);
    }
    
    /**
     * Get logs by status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<AuditLogResponse>> getLogsByStatus(@PathVariable String status) {
        List<AuditLogResponse> logs = auditLogService.getLogsByStatus(status);
        return ResponseEntity.ok(logs);
    }
    
    /**
     * Get logs by date range
     */
    @GetMapping("/date-range")
    public ResponseEntity<List<AuditLogResponse>> getLogsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<AuditLogResponse> logs = auditLogService.getLogsByDateRange(startDate, endDate);
        return ResponseEntity.ok(logs);
    }
    
    /**
     * Get recent logs (last 24 hours)
     */
    @GetMapping("/recent")
    public ResponseEntity<List<AuditLogResponse>> getRecentLogs() {
        List<AuditLogResponse> logs = auditLogService.getRecentLogs();
        return ResponseEntity.ok(logs);
    }
    
    /**
     * Get error logs
     */
    @GetMapping("/errors")
    public ResponseEntity<List<AuditLogResponse>> getErrorLogs() {
        List<AuditLogResponse> logs = auditLogService.getErrorLogs();
        return ResponseEntity.ok(logs);
    }
    
    /**
     * Get failed requests
     */
    @GetMapping("/failed-requests")
    public ResponseEntity<List<AuditLogResponse>> getFailedRequests() {
        List<AuditLogResponse> logs = auditLogService.getFailedRequests();
        return ResponseEntity.ok(logs);
    }
    
    /**
     * Get slow queries
     */
    @GetMapping("/slow-queries")
    public ResponseEntity<List<AuditLogResponse>> getSlowQueries(
            @RequestParam(defaultValue = "5000") Long threshold) {
        List<AuditLogResponse> logs = auditLogService.getSlowQueries(threshold);
        return ResponseEntity.ok(logs);
    }
    
    /**
     * Get logs by IP address
     */
    @GetMapping("/ip/{ipAddress}")
    public ResponseEntity<List<AuditLogResponse>> getLogsByIpAddress(@PathVariable String ipAddress) {
        List<AuditLogResponse> logs = auditLogService.getLogsByIpAddress(ipAddress);
        return ResponseEntity.ok(logs);
    }
    
    /**
     * Get logs by session ID
     */
    @GetMapping("/session/{sessionId}")
    public ResponseEntity<List<AuditLogResponse>> getLogsBySessionId(@PathVariable String sessionId) {
        List<AuditLogResponse> logs = auditLogService.getLogsBySessionId(sessionId);
        return ResponseEntity.ok(logs);
    }
    
    /**
     * Search logs by username
     */
    @GetMapping("/search/username")
    public ResponseEntity<List<AuditLogResponse>> searchLogsByUsername(
            @RequestParam String username) {
        List<AuditLogResponse> logs = auditLogService.searchLogsByUsername(username);
        return ResponseEntity.ok(logs);
    }
    
    /**
     * Search logs by details
     */
    @GetMapping("/search/details")
    public ResponseEntity<List<AuditLogResponse>> searchLogsByDetails(
            @RequestParam String details) {
        List<AuditLogResponse> logs = auditLogService.searchLogsByDetails(details);
        return ResponseEntity.ok(logs);
    }
    
    /**
     * Get log statistics
     */
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getLogStatistics() {
        Map<String, Object> stats = auditLogService.getLogStatistics();
        return ResponseEntity.ok(stats);
    }
    
    /**
     * Delete old logs
     */
    @DeleteMapping("/cleanup")
    public ResponseEntity<String> deleteOldLogs(@RequestParam(defaultValue = "90") int days) {
        auditLogService.deleteOldLogs(days);
        return ResponseEntity.ok("Old logs deleted successfully");
    }
    
    /**
     * Export logs to CSV
     */
    @GetMapping("/export")
    public ResponseEntity<String> exportLogs(
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        
        // This would typically generate and return a CSV file
        // For now, we'll return a success message
        return ResponseEntity.ok("Export functionality will be implemented");
    }
    
    /**
     * Get specific log by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<AuditLogResponse> getLogById(@PathVariable Long id) {
        try {
            AuditLogResponse auditLog = auditLogService.getLogById(id);
            return ResponseEntity.ok(auditLog);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Create test audit logs (for testing purposes)
     */
    @PostMapping("/test/create-sample-logs")
    public ResponseEntity<String> createSampleLogs() {
        try {
            // Create a test user
            User testUser = new User();
            testUser.setId(1L);
            testUser.setEmail("test@example.com");
            testUser.setName("Test User");
            
            // Create various sample logs
            auditLogService.createLog(testUser, "LOGIN", "Test login", "SUCCESS", "127.0.0.1", "Test Browser", "USER", 1L, null, null, null, "POST", "/api/auth/login", 200, 150L, null);
            auditLogService.createLog(testUser, "CREATE_COURSE", "Created test course", "SUCCESS", "127.0.0.1", "Test Browser", "COURSE", 1L, null, null, null, "POST", "/api/courses", 201, 300L, null);
            auditLogService.createLog(testUser, "CREATE_ASSIGNMENT", "Created test assignment", "SUCCESS", "127.0.0.1", "Test Browser", "ASSIGNMENT", 1L, null, null, null, "POST", "/api/assignments", 201, 250L, null);
            auditLogService.createLog(testUser, "SUBMIT_ASSIGNMENT", "Submitted test assignment", "SUCCESS", "127.0.0.1", "Test Browser", "ASSIGNMENT", 1L, null, null, null, "POST", "/api/assignments/submit", 200, 180L, null);
            auditLogService.createLog(testUser, "CREATE_QUIZ", "Created test quiz", "SUCCESS", "127.0.0.1", "Test Browser", "QUIZ", 1L, null, null, null, "POST", "/api/quizzes", 201, 400L, null);
            auditLogService.createLog(testUser, "TAKE_QUIZ", "Attempted test quiz", "SUCCESS", "127.0.0.1", "Test Browser", "QUIZ", 1L, null, null, null, "POST", "/api/quizzes/attempt", 200, 500L, null);
            auditLogService.createLog(testUser, "UPLOAD_FILE", "Uploaded test file", "SUCCESS", "127.0.0.1", "Test Browser", "FILE", 1L, null, null, null, "POST", "/api/files/upload", 200, 220L, null);
            auditLogService.createLog(testUser, "ENROLL_COURSE", "Enrolled in test course", "SUCCESS", "127.0.0.1", "Test Browser", "COURSE", 1L, null, null, null, "POST", "/api/courses/enroll", 200, 120L, null);
            auditLogService.createLog(testUser, "PASSWORD_CHANGE", "Changed password", "SUCCESS", "127.0.0.1", "Test Browser", "USER", 1L, null, null, null, "PUT", "/api/users/password", 200, 90L, null);
            auditLogService.createLog(testUser, "PROFILE_UPDATE", "Updated profile", "SUCCESS", "127.0.0.1", "Test Browser", "USER", 1L, null, null, null, "PUT", "/api/users/profile", 200, 160L, null);
            
            return ResponseEntity.ok("Sample audit logs created successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating sample logs: " + e.getMessage());
        }
    }

    /**
     * Create a single test audit log (for testing purposes)
     */
    @PostMapping("/test/create-single-log")
    public ResponseEntity<String> createSingleLog() {
        try {
            // Create a test user
            User testUser = new User();
            testUser.setId(1L);
            testUser.setEmail("test@example.com");
            testUser.setName("Test User");
            
            // Create a single test log
            auditLogService.createLog(testUser, "TEST_ACTION", "Manual test audit log creation", "SUCCESS", "127.0.0.1", "Test Browser", "SYSTEM", null, null, null, null, "POST", "/api/audit-logs/test/create-single-log", 200, 50L, null);
            
            return ResponseEntity.ok("Single test audit log created successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating test log: " + e.getMessage());
        }
    }
} 