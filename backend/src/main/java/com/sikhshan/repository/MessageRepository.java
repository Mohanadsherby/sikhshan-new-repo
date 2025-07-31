package com.sikhshan.repository;

import com.sikhshan.model.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    
    // Find messages by chat room with pagination
    @Query("SELECT m FROM Message m WHERE m.chatRoom.id = :chatRoomId ORDER BY m.createdAt DESC")
    Page<Message> findByChatRoomIdOrderByCreatedAtDesc(@Param("chatRoomId") Long chatRoomId, Pageable pageable);
    
    // Find messages by chat room (all messages)
    @Query("SELECT m FROM Message m WHERE m.chatRoom.id = :chatRoomId ORDER BY m.createdAt ASC")
    List<Message> findByChatRoomIdOrderByCreatedAtAsc(@Param("chatRoomId") Long chatRoomId);
    
    // Find unread messages for a user in a specific chat room
    @Query("SELECT m FROM Message m WHERE m.chatRoom.id = :chatRoomId AND m.sender.id != :userId AND m.isRead = false ORDER BY m.createdAt ASC")
    List<Message> findUnreadMessagesByChatRoomAndUser(@Param("chatRoomId") Long chatRoomId, @Param("userId") Long userId);
    
    // Count unread messages for a user in a specific chat room
    @Query("SELECT COUNT(m) FROM Message m WHERE m.chatRoom.id = :chatRoomId AND m.sender.id != :userId AND m.isRead = false")
    Long countUnreadMessagesByChatRoomAndUser(@Param("chatRoomId") Long chatRoomId, @Param("userId") Long userId);
    
    // Find last message in a chat room
    @Query("SELECT m FROM Message m WHERE m.chatRoom.id = :chatRoomId ORDER BY m.createdAt DESC, m.id DESC")
    List<Message> findLastMessageByChatRoomId(@Param("chatRoomId") Long chatRoomId);
    
    // Find messages by sender
    @Query("SELECT m FROM Message m WHERE m.sender.id = :senderId ORDER BY m.createdAt DESC")
    List<Message> findBySenderIdOrderByCreatedAtDesc(@Param("senderId") Long senderId);
    
    // Find messages created after a specific time
    @Query("SELECT m FROM Message m WHERE m.chatRoom.id = :chatRoomId AND m.createdAt > :after ORDER BY m.createdAt ASC")
    List<Message> findByChatRoomIdAndCreatedAtAfter(@Param("chatRoomId") Long chatRoomId, @Param("after") LocalDateTime after);
    
    // Mark messages as read
    @Modifying
    @Query("UPDATE Message m SET m.isRead = true WHERE m.chatRoom.id = :chatRoomId AND m.sender.id != :userId AND m.isRead = false")
    void markMessagesAsRead(@Param("chatRoomId") Long chatRoomId, @Param("userId") Long userId);
    
    // Find deleted messages
    @Query("SELECT m FROM Message m WHERE m.chatRoom.id = :chatRoomId AND m.isDeleted = true ORDER BY m.createdAt DESC")
    List<Message> findDeletedMessagesByChatRoomId(@Param("chatRoomId") Long chatRoomId);
    
    // Count total messages in a chat room
    @Query("SELECT COUNT(m) FROM Message m WHERE m.chatRoom.id = :chatRoomId")
    Long countByChatRoomId(@Param("chatRoomId") Long chatRoomId);
    
    // Find messages by date range
    @Query("SELECT m FROM Message m WHERE m.chatRoom.id = :chatRoomId AND m.createdAt BETWEEN :startDate AND :endDate ORDER BY m.createdAt ASC")
    List<Message> findByChatRoomIdAndDateRange(@Param("chatRoomId") Long chatRoomId, 
                                              @Param("startDate") LocalDateTime startDate, 
                                              @Param("endDate") LocalDateTime endDate);
} 