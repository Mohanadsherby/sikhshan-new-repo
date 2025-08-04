package com.sikhshan.repository;

import com.sikhshan.model.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    
    // Find logs by user
    List<AuditLog> findByUserIdOrderByTimestampDesc(Long userId);
    
    // Find logs by action
    List<AuditLog> findByActionOrderByTimestampDesc(String action);
    
    // Find logs by status
    List<AuditLog> findByStatusOrderByTimestampDesc(String status);
    
    // Find logs by resource type
    List<AuditLog> findByResourceTypeOrderByTimestampDesc(String resourceType);
    
    // Find logs by resource ID
    List<AuditLog> findByResourceIdOrderByTimestampDesc(Long resourceId);
    
    // Find logs by date range
    List<AuditLog> findByTimestampBetweenOrderByTimestampDesc(LocalDateTime startDate, LocalDateTime endDate);
    
    // Find logs by user and date range
    List<AuditLog> findByUserIdAndTimestampBetweenOrderByTimestampDesc(Long userId, LocalDateTime startDate, LocalDateTime endDate);
    
    // Find logs by action and date range
    List<AuditLog> findByActionAndTimestampBetweenOrderByTimestampDesc(String action, LocalDateTime startDate, LocalDateTime endDate);
    
    // Find logs by status and date range
    List<AuditLog> findByStatusAndTimestampBetweenOrderByTimestampDesc(String status, LocalDateTime startDate, LocalDateTime endDate);
    
    // Find logs by IP address
    List<AuditLog> findByIpAddressOrderByTimestampDesc(String ipAddress);
    
    // Find logs by session ID
    List<AuditLog> findBySessionIdOrderByTimestampDesc(String sessionId);
    
    // Search logs by username (case-insensitive)
    @Query("SELECT a FROM AuditLog a WHERE LOWER(a.username) LIKE LOWER(CONCAT('%', :username, '%')) ORDER BY a.timestamp DESC")
    List<AuditLog> findByUsernameContainingIgnoreCase(@Param("username") String username);
    
    // Search logs by details (case-insensitive)
    @Query("SELECT a FROM AuditLog a WHERE LOWER(a.details) LIKE LOWER(CONCAT('%', :details, '%')) ORDER BY a.timestamp DESC")
    List<AuditLog> findByDetailsContainingIgnoreCase(@Param("details") String details);
    
    // Complex search with multiple criteria
    @Query("SELECT a FROM AuditLog a WHERE " +
           "(:username IS NULL OR LOWER(a.username) LIKE LOWER(CONCAT('%', :username, '%'))) AND " +
           "(:action IS NULL OR a.action = :action) AND " +
           "(:status IS NULL OR a.status = :status) AND " +
           "(:resourceType IS NULL OR a.resourceType = :resourceType) AND " +
           "(:startDate IS NULL OR a.timestamp >= :startDate) AND " +
           "(:endDate IS NULL OR a.timestamp <= :endDate) AND " +
           "(:searchTerm IS NULL OR LOWER(a.details) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
           "ORDER BY a.timestamp DESC")
    Page<AuditLog> findWithFilters(
        @Param("username") String username,
        @Param("action") String action,
        @Param("status") String status,
        @Param("resourceType") String resourceType,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate,
        @Param("searchTerm") String searchTerm,
        Pageable pageable
    );
    
    // Get recent logs (last 24 hours)
    @Query("SELECT a FROM AuditLog a WHERE a.timestamp >= :startDate ORDER BY a.timestamp DESC")
    List<AuditLog> findRecentLogs(@Param("startDate") LocalDateTime startDate);
    
    // Get logs count by action
    @Query("SELECT a.action, COUNT(a) FROM AuditLog a GROUP BY a.action ORDER BY COUNT(a) DESC")
    List<Object[]> getLogCountByAction();
    
    // Get logs count by status
    @Query("SELECT a.status, COUNT(a) FROM AuditLog a GROUP BY a.status ORDER BY COUNT(a) DESC")
    List<Object[]> getLogCountByStatus();
    
    // Get logs count by user
    @Query("SELECT a.username, COUNT(a) FROM AuditLog a GROUP BY a.username ORDER BY COUNT(a) DESC")
    List<Object[]> getLogCountByUser();
    
    // Get logs count by date (daily)
    @Query("SELECT DATE(a.timestamp), COUNT(a) FROM AuditLog a GROUP BY DATE(a.timestamp) ORDER BY DATE(a.timestamp) DESC")
    List<Object[]> getLogCountByDate();
    
    // Find error logs (duplicate removed - already defined above)
    
    // Find logs with execution time greater than threshold (for performance monitoring)
    @Query("SELECT a FROM AuditLog a WHERE a.executionTime > :threshold ORDER BY a.timestamp DESC")
    List<AuditLog> findSlowQueries(@Param("threshold") Long threshold);
    
    // Find logs by response status
    List<AuditLog> findByResponseStatusOrderByTimestampDesc(Integer responseStatus);
    
    // Find failed requests (4xx and 5xx status codes)
    @Query("SELECT a FROM AuditLog a WHERE a.responseStatus >= 400 ORDER BY a.timestamp DESC")
    List<AuditLog> findFailedRequests();
} 