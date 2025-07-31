package com.sikhshan.repository;

import com.sikhshan.model.User;
import com.sikhshan.model.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserStatusRepository extends JpaRepository<UserStatus, Long> {
    
    // Find user status by user
    Optional<UserStatus> findByUser(User user);
    
    // Find user status by user ID
    @Query("SELECT us FROM UserStatus us WHERE us.user.id = :userId")
    Optional<UserStatus> findByUserId(@Param("userId") Long userId);
    
    // Find all online users
    @Query("SELECT us FROM UserStatus us WHERE us.isOnline = true")
    List<UserStatus> findOnlineUsers();
    
    // Find users who were online recently (within last 5 minutes)
    @Query("SELECT us FROM UserStatus us WHERE us.lastSeen > :recentTime")
    List<UserStatus> findRecentlyActiveUsers(@Param("recentTime") LocalDateTime recentTime);
    
    // Mark user as online
    @Modifying
    @Query("UPDATE UserStatus us SET us.isOnline = true, us.lastSeen = :now WHERE us.user.id = :userId")
    void markUserOnline(@Param("userId") Long userId, @Param("now") LocalDateTime now);
    
    // Mark user as offline
    @Modifying
    @Query("UPDATE UserStatus us SET us.isOnline = false, us.lastSeen = :now WHERE us.user.id = :userId")
    void markUserOffline(@Param("userId") Long userId, @Param("now") LocalDateTime now);
    
    // Update last seen time
    @Modifying
    @Query("UPDATE UserStatus us SET us.lastSeen = :now WHERE us.user.id = :userId")
    void updateLastSeen(@Param("userId") Long userId, @Param("now") LocalDateTime now);
    
    // Find users who haven't been seen for a while (offline for more than 5 minutes)
    @Query("SELECT us FROM UserStatus us WHERE us.isOnline = true AND us.lastSeen < :offlineTime")
    List<UserStatus> findUsersToMarkOffline(@Param("offlineTime") LocalDateTime offlineTime);
    
    // Count online users
    @Query("SELECT COUNT(us) FROM UserStatus us WHERE us.isOnline = true")
    Long countOnlineUsers();
    
    // Find user statuses by user IDs
    @Query("SELECT us FROM UserStatus us WHERE us.user.id IN :userIds")
    List<UserStatus> findByUserIds(@Param("userIds") List<Long> userIds);
} 