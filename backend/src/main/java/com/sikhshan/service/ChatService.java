package com.sikhshan.service;

import com.sikhshan.dto.*;
import com.sikhshan.model.*;
import com.sikhshan.repository.ChatRoomRepository;
import com.sikhshan.repository.MessageRepository;
import com.sikhshan.repository.UserRepository;
import com.sikhshan.repository.UserStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class ChatService {
    
    @Autowired
    private ChatRoomRepository chatRoomRepository;
    
    @Autowired
    private MessageRepository messageRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    // @Autowired
    // private UserStatusRepository userStatusRepository; // Temporarily disabled
    
    // Chat Room Operations
    
    public ChatRoomResponse createChatRoom(ChatRoomRequest request) {
        // Check if chat room already exists
        Optional<ChatRoom> existingChatRoom = chatRoomRepository.findByUsers(request.getUser1Id(), request.getUser2Id());
        if (existingChatRoom.isPresent()) {
            return toChatRoomResponse(existingChatRoom.get());
        }
        
        // Get users
        User user1 = userRepository.findById(request.getUser1Id())
                .orElseThrow(() -> new RuntimeException("User 1 not found"));
        User user2 = userRepository.findById(request.getUser2Id())
                .orElseThrow(() -> new RuntimeException("User 2 not found"));
        
        // Create new chat room
        ChatRoom chatRoom = new ChatRoom(user1, user2);
        ChatRoom savedChatRoom = chatRoomRepository.save(chatRoom);
        
        return toChatRoomResponse(savedChatRoom);
    }
    
    public List<ChatRoomResponse> getChatRoomsForUser(Long userId) {
        List<ChatRoom> chatRooms = chatRoomRepository.findByUserIdOrderByLastMessageAtDesc(userId);
        return chatRooms.stream()
                .map(this::toChatRoomResponse)
                .collect(Collectors.toList());
    }
    
    public ChatRoomResponse getChatRoomById(Long chatRoomId, Long userId) {
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new RuntimeException("Chat room not found"));
        
        // Verify user is part of this chat room
        if (!chatRoom.containsUser(userId)) {
            throw new RuntimeException("User not authorized to access this chat room");
        }
        
        return toChatRoomResponse(chatRoom);
    }
    
    public ChatRoomResponse getChatRoomByUsers(Long user1Id, Long user2Id) {
        Optional<ChatRoom> chatRoom = chatRoomRepository.findByUsers(user1Id, user2Id);
        if (chatRoom.isPresent()) {
            return toChatRoomResponse(chatRoom.get());
        }
        return null;
    }
    
    // Message Operations
    
    public MessageResponse sendMessage(MessageRequest request, Long senderId) {
        // Get chat room
        ChatRoom chatRoom = chatRoomRepository.findById(request.getChatRoomId())
                .orElseThrow(() -> new RuntimeException("Chat room not found"));
        
        // Verify sender is part of this chat room
        if (!chatRoom.containsUser(senderId)) {
            throw new RuntimeException("User not authorized to send message to this chat room");
        }
        
        // Get sender
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        
        // Create message
        Message message = new Message();
        message.setChatRoom(chatRoom);
        message.setSender(sender);
        message.setContent(request.getContent());
        message.setMessageType(Message.MessageType.valueOf(request.getMessageType()));
        message.setFileUrl(request.getFileUrl());
        
        Message savedMessage = messageRepository.save(message);
        
        // Update chat room's last message time
        chatRoom.setLastMessageAt(LocalDateTime.now());
        chatRoomRepository.save(chatRoom);
        
        return toMessageResponse(savedMessage);
    }
    
    public List<MessageResponse> getMessagesByChatRoom(Long chatRoomId, Long userId, int page, int size) {
        // Verify user is part of this chat room
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new RuntimeException("Chat room not found"));
        
        if (!chatRoom.containsUser(userId)) {
            throw new RuntimeException("User not authorized to access this chat room");
        }
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Message> messages = messageRepository.findByChatRoomIdOrderByCreatedAtDesc(chatRoomId, pageable);
        
        return messages.getContent().stream()
                .map(this::toMessageResponse)
                .collect(Collectors.toList());
    }
    
    public MessageResponse deleteMessage(Long messageId, Long userId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        
        // Verify user is the sender of the message
        if (!message.isFromUser(userId)) {
            throw new RuntimeException("User not authorized to delete this message");
        }
        
        // Get user who is deleting
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Soft delete the message
        message.delete(user);
        Message savedMessage = messageRepository.save(message);
        
        return toMessageResponse(savedMessage);
    }
    
    public void markMessagesAsRead(Long chatRoomId, Long userId) {
        // Verify user is part of this chat room
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new RuntimeException("Chat room not found"));
        
        if (!chatRoom.containsUser(userId)) {
            throw new RuntimeException("User not authorized to access this chat room");
        }
        
        messageRepository.markMessagesAsRead(chatRoomId, userId);
    }
    
    public Long getUnreadMessageCount(Long chatRoomId, Long userId) {
        return messageRepository.countUnreadMessagesByChatRoomAndUser(chatRoomId, userId);
    }
    
    // User Status Operations
    
    public void markUserOnline(Long userId) {
        // Temporary fix: Skip user status updates until database is updated
        // UserStatus userStatus = userStatusRepository.findByUserId(userId)
        //         .orElseGet(() -> {
        //             User user = userRepository.findById(userId)
        //                     .orElseThrow(() -> new RuntimeException("User not found"));
        //             return new UserStatus(user);
        //         });
        
        // userStatus.markOnline();
        // userStatusRepository.save(userStatus);
    }
    
    public void markUserOffline(Long userId) {
        // Temporary fix: Skip user status updates until database is updated
        // UserStatus userStatus = userStatusRepository.findByUserId(userId)
        //         .orElseGet(() -> {
        //             User user = userRepository.findById(userId)
        //                     .orElseThrow(() -> new RuntimeException("User not found"));
        //             return new UserStatus(user);
        //         });
        
        // userStatus.markOffline();
        // userStatusRepository.save(userStatus);
    }
    
    public void updateUserLastSeen(Long userId) {
        // Temporary fix: Skip user status updates until database is updated
        // UserStatus userStatus = userStatusRepository.findByUserId(userId)
        //         .orElseGet(() -> {
        //             User user = userRepository.findById(userId)
        //                     .orElseThrow(() -> new RuntimeException("User not found"));
        //             return new UserStatus(user);
        //         });
        
        // userStatus.updateLastSeen();
        // userStatusRepository.save(userStatus);
    }
    
    // Helper Methods
    
    private ChatRoomResponse toChatRoomResponse(ChatRoom chatRoom) {
        ChatRoomResponse response = new ChatRoomResponse();
        response.setId(chatRoom.getId());
        response.setCreatedAt(chatRoom.getCreatedAt());
        response.setLastMessageAt(chatRoom.getLastMessageAt());
        
        // Set user summaries
        response.setUser1(toUserSummary(chatRoom.getUser1()));
        response.setUser2(toUserSummary(chatRoom.getUser2()));
        
        // Set last message
        List<Message> lastMessages = messageRepository.findLastMessageByChatRoomId(chatRoom.getId());
        if (!lastMessages.isEmpty()) {
            response.setLastMessage(toMessageSummary(lastMessages.get(0)));
        }
        
        return response;
    }
    
    private ChatRoomResponse.UserSummary toUserSummary(User user) {
        // Temporary fix: Skip user status lookup until database is updated
        Boolean isOnline = false; // Default to offline
        
        return new ChatRoomResponse.UserSummary(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getProfilePictureUrl(),
                user.getRole().name(),
                isOnline
        );
    }
    
    private ChatRoomResponse.MessageSummary toMessageSummary(Message message) {
        return new ChatRoomResponse.MessageSummary(
                message.getId(),
                message.getDisplayContent(),
                message.getSender().getName() != null ? message.getSender().getName() : message.getSender().getEmail(),
                message.getCreatedAt(),
                message.getIsDeleted()
        );
    }
    
    private MessageResponse toMessageResponse(Message message) {
        MessageResponse response = new MessageResponse();
        response.setId(message.getId());
        response.setChatRoomId(message.getChatRoom().getId());
        response.setContent(message.getDisplayContent());
        response.setMessageType(message.getMessageType().name());
        response.setFileUrl(message.getFileUrl());
        response.setCreatedAt(message.getCreatedAt());
        response.setIsRead(message.getIsRead());
        response.setIsDeleted(message.getIsDeleted());
        response.setDeletedAt(message.getDeletedAt());
        
        // Set sender info
        response.setSender(toSenderInfo(message.getSender()));
        
        // Set deleted by info if message is deleted
        if (message.getIsDeleted() && message.getDeletedBy() != null) {
            response.setDeletedBy(toSenderInfo(message.getDeletedBy()));
        }
        
        return response;
    }
    
    private MessageResponse.SenderInfo toSenderInfo(User user) {
        return new MessageResponse.SenderInfo(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getProfilePictureUrl(),
                user.getRole().name()
        );
    }
} 