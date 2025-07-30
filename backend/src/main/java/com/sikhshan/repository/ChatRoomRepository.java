package com.sikhshan.repository;

import com.sikhshan.model.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    
    // Find chat room between two users (order doesn't matter)
    @Query("SELECT cr FROM ChatRoom cr WHERE (cr.user1.id = :user1Id AND cr.user2.id = :user2Id) OR (cr.user1.id = :user2Id AND cr.user2.id = :user1Id)")
    Optional<ChatRoom> findByUsers(@Param("user1Id") Long user1Id, @Param("user2Id") Long user2Id);
    
    // Find all chat rooms for a user
    @Query("SELECT cr FROM ChatRoom cr WHERE cr.user1.id = :userId OR cr.user2.id = :userId ORDER BY cr.lastMessageAt DESC")
    List<ChatRoom> findByUserId(@Param("userId") Long userId);
    
    // Find all chat rooms for a user with pagination
    @Query("SELECT cr FROM ChatRoom cr WHERE cr.user1.id = :userId OR cr.user2.id = :userId ORDER BY cr.lastMessageAt DESC")
    List<ChatRoom> findByUserIdOrderByLastMessageAtDesc(@Param("userId") Long userId);
    
    // Check if chat room exists between two users
    @Query("SELECT COUNT(cr) > 0 FROM ChatRoom cr WHERE (cr.user1.id = :user1Id AND cr.user2.id = :user2Id) OR (cr.user1.id = :user2Id AND cr.user2.id = :user1Id)")
    boolean existsByUsers(@Param("user1Id") Long user1Id, @Param("user2Id") Long user2Id);
    
    // Find chat rooms with unread messages for a user
    @Query("SELECT cr FROM ChatRoom cr WHERE (cr.user1.id = :userId OR cr.user2.id = :userId) AND EXISTS (SELECT m FROM Message m WHERE m.chatRoom = cr AND m.sender.id != :userId AND m.isRead = false)")
    List<ChatRoom> findChatRoomsWithUnreadMessages(@Param("userId") Long userId);
} 