package com.sikhshan.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sikhshan.model.User;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;

@Component
public class AuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private ObjectMapper objectMapper;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        try {
            // Extract JWT token from Authorization header
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                
                // For now, we'll create a simple user object
                // In a real implementation, you would decode the JWT token
                User currentUser = extractUserFromToken(token);
                if (currentUser != null) {
                    request.setAttribute("currentUser", currentUser);
                }
            }
        } catch (Exception e) {
            // Log error but don't fail the request
            System.err.println("Error in authentication filter: " + e.getMessage());
        }
        
        filterChain.doFilter(request, response);
    }

    private User extractUserFromToken(String token) {
        try {
            // This is a simplified implementation
            // In a real app, you would decode the JWT token and extract user info
            
            // For now, we'll create a mock user based on the token
            // You can replace this with actual JWT decoding logic
            if (token != null && !token.isEmpty()) {
                User user = new User();
                user.setId(1L); // You would get this from the token
                user.setEmail("user@example.com"); // You would get this from the token
                user.setName("Test User"); // You would get this from the token
                return user;
            }
        } catch (Exception e) {
            System.err.println("Error extracting user from token: " + e.getMessage());
        }
        return null;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        // Skip authentication for certain paths
        String path = request.getRequestURI();
        return path.startsWith("/api/auth/") || 
               path.startsWith("/api/audit-logs/") ||
               path.startsWith("/static/") ||
               path.startsWith("/css/") ||
               path.startsWith("/js/") ||
               path.startsWith("/images/") ||
               path.equals("/actuator/health");
    }
} 