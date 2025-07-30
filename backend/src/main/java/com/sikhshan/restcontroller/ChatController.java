package com.sikhshan.restcontroller;

import com.sikhshan.dto.*;
import com.sikhshan.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatController {
    
    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);
    
    @Autowired
    private ChatService chatService;
    
    // Chat Room Endpoints
    
    @PostMapping("/rooms")
    public ResponseEntity<ChatRoomResponse> createChatRoom(@RequestBody ChatRoomRequest request) {
        try {
            logger.info("Creating chat room with request: user1Id={}, user2Id={}", request.getUser1Id(), request.getUser2Id());
            ChatRoomResponse response = chatService.createChatRoom(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error creating chat room: ", e);
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/rooms")
    public ResponseEntity<List<ChatRoomResponse>> getChatRooms(@RequestParam Long userId) {
        try {
            List<ChatRoomResponse> chatRooms = chatService.getChatRoomsForUser(userId);
            return ResponseEntity.ok(chatRooms);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/rooms/{chatRoomId}")
    public ResponseEntity<ChatRoomResponse> getChatRoom(@PathVariable Long chatRoomId, @RequestParam Long userId) {
        try {
            ChatRoomResponse response = chatService.getChatRoomById(chatRoomId, userId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/rooms/users")
    public ResponseEntity<ChatRoomResponse> getChatRoomByUsers(@RequestParam Long user1Id, @RequestParam Long user2Id) {
        try {
            ChatRoomResponse response = chatService.getChatRoomByUsers(user1Id, user2Id);
            if (response != null) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Message Endpoints
    
    @PostMapping("/messages")
    public ResponseEntity<MessageResponse> sendMessage(@RequestBody MessageRequest request, @RequestParam Long senderId) {
        try {
            MessageResponse response = chatService.sendMessage(request, senderId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/rooms/{chatRoomId}/messages")
    public ResponseEntity<List<MessageResponse>> getMessages(
            @PathVariable Long chatRoomId,
            @RequestParam Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        try {
            List<MessageResponse> messages = chatService.getMessagesByChatRoom(chatRoomId, userId, page, size);
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/messages/{messageId}")
    public ResponseEntity<MessageResponse> deleteMessage(@PathVariable Long messageId, @RequestParam Long userId) {
        try {
            MessageResponse response = chatService.deleteMessage(messageId, userId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/rooms/{chatRoomId}/read")
    public ResponseEntity<Void> markMessagesAsRead(@PathVariable Long chatRoomId, @RequestParam Long userId) {
        try {
            chatService.markMessagesAsRead(chatRoomId, userId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/rooms/{chatRoomId}/unread-count")
    public ResponseEntity<Long> getUnreadMessageCount(@PathVariable Long chatRoomId, @RequestParam Long userId) {
        try {
            Long count = chatService.getUnreadMessageCount(chatRoomId, userId);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // User Status Endpoints
    
    @PostMapping("/users/{userId}/online")
    public ResponseEntity<Void> markUserOnline(@PathVariable Long userId) {
        try {
            chatService.markUserOnline(userId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/users/{userId}/offline")
    public ResponseEntity<Void> markUserOffline(@PathVariable Long userId) {
        try {
            chatService.markUserOffline(userId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/users/{userId}/last-seen")
    public ResponseEntity<Void> updateUserLastSeen(@PathVariable Long userId) {
        try {
            chatService.updateUserLastSeen(userId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
} 