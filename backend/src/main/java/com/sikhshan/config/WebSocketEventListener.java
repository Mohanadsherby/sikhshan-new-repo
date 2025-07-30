package com.sikhshan.config;

import com.sikhshan.service.ChatService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
public class WebSocketEventListener {
    
    private static final Logger logger = LoggerFactory.getLogger(WebSocketEventListener.class);
    
    @Autowired
    private ChatService chatService;
    
    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        logger.info("Received a new web socket connection");
        
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        
        // Extract user ID from the session attributes if available
        String userId = headerAccessor.getUser() != null ? headerAccessor.getUser().getName() : null;
        
        if (userId != null) {
            try {
                Long userIdLong = Long.parseLong(userId);
                chatService.markUserOnline(userIdLong);
                logger.info("User {} marked as online", userId);
            } catch (NumberFormatException e) {
                logger.warn("Invalid user ID format: {}", userId);
            }
        }
    }
    
    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        logger.info("User disconnected");
        
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        
        // Extract user ID from the session attributes if available
        String userId = headerAccessor.getUser() != null ? headerAccessor.getUser().getName() : null;
        
        if (userId != null) {
            try {
                Long userIdLong = Long.parseLong(userId);
                chatService.markUserOffline(userIdLong);
                logger.info("User {} marked as offline", userId);
            } catch (NumberFormatException e) {
                logger.warn("Invalid user ID format: {}", userId);
            }
        }
    }
} 