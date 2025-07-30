package com.sikhshan.restcontroller;

import com.sikhshan.dto.MessageRequest;
import com.sikhshan.dto.MessageResponse;
import com.sikhshan.dto.WebSocketMessage;
import com.sikhshan.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {
    
    @Autowired
    private ChatService chatService;
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public WebSocketMessage sendMessage(@Payload MessageRequest messageRequest, SimpMessageHeaderAccessor headerAccessor) {
        try {
            // Extract sender ID from header
            String senderIdStr = headerAccessor.getUser() != null ? headerAccessor.getUser().getName() : null;
            if (senderIdStr == null) {
                throw new RuntimeException("Sender ID not found");
            }
            
            Long senderId = Long.parseLong(senderIdStr);
            
            // Send message through chat service
            MessageResponse messageResponse = chatService.sendMessage(messageRequest, senderId);
            
            // Create WebSocket message
            WebSocketMessage wsMessage = WebSocketMessage.newMessage(messageResponse);
            
            // Send to specific chat room topic
            messagingTemplate.convertAndSend("/topic/chat/" + messageRequest.getChatRoomId(), wsMessage);
            
            return wsMessage;
        } catch (Exception e) {
            // Return error message
            return new WebSocketMessage("ERROR", "Failed to send message: " + e.getMessage());
        }
    }
    
    @MessageMapping("/chat.deleteMessage")
    public void deleteMessage(@Payload WebSocketMessage deleteRequest, SimpMessageHeaderAccessor headerAccessor) {
        try {
            // Extract sender ID from header
            String senderIdStr = headerAccessor.getUser() != null ? headerAccessor.getUser().getName() : null;
            if (senderIdStr == null) {
                throw new RuntimeException("Sender ID not found");
            }
            
            Long senderId = Long.parseLong(senderIdStr);
            Long messageId = Long.parseLong(deleteRequest.getData().toString());
            
            // Delete message through chat service
            MessageResponse messageResponse = chatService.deleteMessage(messageId, senderId);
            
            // Create WebSocket message for deletion
            WebSocketMessage wsMessage = WebSocketMessage.messageDeleted(messageId, messageResponse.getChatRoomId(), senderId);
            
            // Send to specific chat room topic
            messagingTemplate.convertAndSend("/topic/chat/" + messageResponse.getChatRoomId(), wsMessage);
        } catch (Exception e) {
            // Send error message
            WebSocketMessage errorMessage = new WebSocketMessage("ERROR", "Failed to delete message: " + e.getMessage());
            messagingTemplate.convertAndSend("/user/" + headerAccessor.getUser().getName() + "/queue/errors", errorMessage);
        }
    }
    
    @MessageMapping("/chat.markAsRead")
    public void markMessagesAsRead(@Payload WebSocketMessage readRequest, SimpMessageHeaderAccessor headerAccessor) {
        try {
            // Extract sender ID from header
            String senderIdStr = headerAccessor.getUser() != null ? headerAccessor.getUser().getName() : null;
            if (senderIdStr == null) {
                throw new RuntimeException("Sender ID not found");
            }
            
            Long senderId = Long.parseLong(senderIdStr);
            Long chatRoomId = Long.parseLong(readRequest.getData().toString());
            
            // Mark messages as read through chat service
            chatService.markMessagesAsRead(chatRoomId, senderId);
            
            // Create WebSocket message for read receipt
            WebSocketMessage wsMessage = WebSocketMessage.messageRead(chatRoomId, senderId);
            
            // Send to specific chat room topic
            messagingTemplate.convertAndSend("/topic/chat/" + chatRoomId, wsMessage);
        } catch (Exception e) {
            // Send error message
            WebSocketMessage errorMessage = new WebSocketMessage("ERROR", "Failed to mark messages as read: " + e.getMessage());
            messagingTemplate.convertAndSend("/user/" + headerAccessor.getUser().getName() + "/queue/errors", errorMessage);
        }
    }
    
    @MessageMapping("/chat.typing")
    public void handleTyping(@Payload WebSocketMessage typingRequest, SimpMessageHeaderAccessor headerAccessor) {
        try {
            // Extract sender ID from header
            String senderIdStr = headerAccessor.getUser() != null ? headerAccessor.getUser().getName() : null;
            if (senderIdStr == null) {
                throw new RuntimeException("Sender ID not found");
            }
            
            Long senderId = Long.parseLong(senderIdStr);
            Long chatRoomId = Long.parseLong(typingRequest.getData().toString());
            
            // Send typing indicator to chat room
            WebSocketMessage wsMessage = WebSocketMessage.typingStart(chatRoomId, senderId);
            messagingTemplate.convertAndSend("/topic/chat/" + chatRoomId, wsMessage);
        } catch (Exception e) {
            // Handle error silently for typing indicators
        }
    }
    
    @MessageMapping("/chat.stopTyping")
    public void handleStopTyping(@Payload WebSocketMessage typingRequest, SimpMessageHeaderAccessor headerAccessor) {
        try {
            // Extract sender ID from header
            String senderIdStr = headerAccessor.getUser() != null ? headerAccessor.getUser().getName() : null;
            if (senderIdStr == null) {
                throw new RuntimeException("Sender ID not found");
            }
            
            Long senderId = Long.parseLong(senderIdStr);
            Long chatRoomId = Long.parseLong(typingRequest.getData().toString());
            
            // Send stop typing indicator to chat room
            WebSocketMessage wsMessage = WebSocketMessage.typingStop(chatRoomId, senderId);
            messagingTemplate.convertAndSend("/topic/chat/" + chatRoomId, wsMessage);
        } catch (Exception e) {
            // Handle error silently for typing indicators
        }
    }
} 