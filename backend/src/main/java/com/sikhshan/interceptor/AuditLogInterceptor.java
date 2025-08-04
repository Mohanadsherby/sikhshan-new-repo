package com.sikhshan.interceptor;

import com.sikhshan.model.User;
import com.sikhshan.service.AuditLogService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Component
public class AuditLogInterceptor implements HandlerInterceptor {

    @Autowired
    private AuditLogService auditLogService;

    private static final Map<String, String> ACTION_MAPPING = new HashMap<>();
    private static final Map<String, String> RESOURCE_MAPPING = new HashMap<>();

    static {
        // User actions
        ACTION_MAPPING.put("POST /api/auth/login", "LOGIN");
        ACTION_MAPPING.put("POST /api/auth/logout", "LOGOUT");
        ACTION_MAPPING.put("POST /api/auth/register", "CREATE_USER");
        ACTION_MAPPING.put("PUT /api/users", "UPDATE_USER");
        ACTION_MAPPING.put("DELETE /api/users", "DELETE_USER");
        ACTION_MAPPING.put("PUT /api/users/password", "PASSWORD_CHANGE");
        ACTION_MAPPING.put("PUT /api/users/profile", "PROFILE_UPDATE");

        // Course actions
        ACTION_MAPPING.put("POST /api/courses", "CREATE_COURSE");
        ACTION_MAPPING.put("PUT /api/courses", "UPDATE_COURSE");
        ACTION_MAPPING.put("DELETE /api/courses", "DELETE_COURSE");
        ACTION_MAPPING.put("POST /api/courses/enroll", "ENROLL_COURSE");
        ACTION_MAPPING.put("DELETE /api/courses/enroll", "UNENROLL_COURSE");

        // Assignment actions
        ACTION_MAPPING.put("POST /api/assignments", "CREATE_ASSIGNMENT");
        ACTION_MAPPING.put("PUT /api/assignments", "UPDATE_ASSIGNMENT");
        ACTION_MAPPING.put("DELETE /api/assignments", "DELETE_ASSIGNMENT");
        ACTION_MAPPING.put("POST /api/assignments/submit", "SUBMIT_ASSIGNMENT");
        ACTION_MAPPING.put("PUT /api/assignments/grade", "GRADE_ASSIGNMENT");

        // Quiz actions
        ACTION_MAPPING.put("POST /api/quizzes", "CREATE_QUIZ");
        ACTION_MAPPING.put("PUT /api/quizzes", "UPDATE_QUIZ");
        ACTION_MAPPING.put("DELETE /api/quizzes", "DELETE_QUIZ");
        ACTION_MAPPING.put("POST /api/quizzes/attempt", "TAKE_QUIZ");
        ACTION_MAPPING.put("PUT /api/quizzes/grade", "GRADE_QUIZ");

        // File actions
        ACTION_MAPPING.put("POST /api/files/upload", "UPLOAD_FILE");
        ACTION_MAPPING.put("DELETE /api/files", "DELETE_FILE");

        // System actions
        ACTION_MAPPING.put("POST /api/system/backup", "SYSTEM_BACKUP");
        ACTION_MAPPING.put("POST /api/system/restore", "SYSTEM_RESTORE");

        // Resource type mapping
        RESOURCE_MAPPING.put("/api/users", "USER");
        RESOURCE_MAPPING.put("/api/courses", "COURSE");
        RESOURCE_MAPPING.put("/api/assignments", "ASSIGNMENT");
        RESOURCE_MAPPING.put("/api/quizzes", "QUIZ");
        RESOURCE_MAPPING.put("/api/files", "FILE");
        RESOURCE_MAPPING.put("/api/system", "SYSTEM");
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // Store request start time
        request.setAttribute("startTime", System.currentTimeMillis());
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        // This method is called after the handler is executed but before the view is rendered
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        try {
            // Get request details
            String method = request.getMethod();
            String requestURI = request.getRequestURI();
            String fullPath = method + " " + requestURI;
            
            // Skip audit logging for certain paths
            if (shouldSkipAuditLogging(requestURI)) {
                return;
            }

            // For now, we'll create system logs without user authentication
            // In a real implementation, you would extract user from JWT token or session
            User user = null;
            
            // Try to get user from request attributes (if set by authentication filter)
            Object userObj = request.getAttribute("currentUser");
            if (userObj instanceof User) {
                user = (User) userObj;
            }

            // For debugging - log even without user for now
            System.out.println("Audit Log - URI: " + requestURI + ", Method: " + method + ", User: " + (user != null ? user.getEmail() : "null"));

            // Determine action and resource type
            String action = ACTION_MAPPING.get(fullPath);
            String resourceType = getResourceType(requestURI);
            
            if (action == null) {
                // For unmapped actions, create a generic action name
                action = method + "_" + resourceType;
            }

            // Get execution time
            Long startTime = (Long) request.getAttribute("startTime");
            Long executionTime = startTime != null ? System.currentTimeMillis() - startTime : null;

            // Determine status
            String status = response.getStatus() >= 200 && response.getStatus() < 300 ? "SUCCESS" : "ERROR";
            if (ex != null) {
                status = "ERROR";
            }

            // Create details
            String details = createDetails(request, response, ex);

            // Log the audit entry - log even without user for now
            try {
                if (user != null) {
                    auditLogService.createLog(
                        user,
                        action,
                        details,
                        status,
                        getClientIpAddress(request),
                        request.getHeader("User-Agent"),
                        resourceType,
                        extractResourceId(requestURI),
                        null, // oldValues
                        null, // newValues
                        request.getSession() != null ? request.getSession().getId() : null,
                        method,
                        requestURI,
                        response.getStatus(),
                        executionTime,
                        ex != null ? ex.getMessage() : null
                    );
                } else {
                    // Create a system user for anonymous actions
                    User systemUser = new User();
                    systemUser.setId(0L);
                    systemUser.setEmail("system@localhost");
                    systemUser.setName("System");
                    
                    auditLogService.createLog(
                        systemUser,
                        action,
                        details,
                        status,
                        getClientIpAddress(request),
                        request.getHeader("User-Agent"),
                        resourceType,
                        extractResourceId(requestURI),
                        null, // oldValues
                        null, // newValues
                        request.getSession() != null ? request.getSession().getId() : null,
                        method,
                        requestURI,
                        response.getStatus(),
                        executionTime,
                        ex != null ? ex.getMessage() : null
                    );
                }
            } catch (Exception auditError) {
                System.err.println("Error creating audit log: " + auditError.getMessage());
                auditError.printStackTrace();
            }
        } catch (Exception e) {
            // Don't let audit logging errors affect the main application
            System.err.println("Error in audit logging: " + e.getMessage());
        }
    }

    private boolean shouldSkipAuditLogging(String requestURI) {
        // Skip audit logging for static resources, health checks, and audit logs themselves
        return requestURI.startsWith("/static/") ||
               requestURI.startsWith("/css/") ||
               requestURI.startsWith("/js/") ||
               requestURI.startsWith("/images/") ||
               requestURI.equals("/actuator/health") ||
               requestURI.startsWith("/api/audit-logs") ||
               requestURI.startsWith("/api/chat") ||  // Skip chat endpoints
               requestURI.startsWith("/error");
    }

    private String getResourceType(String requestURI) {
        for (Map.Entry<String, String> entry : RESOURCE_MAPPING.entrySet()) {
            if (requestURI.startsWith(entry.getKey())) {
                return entry.getValue();
            }
        }
        return "UNKNOWN";
    }

    private Long extractResourceId(String requestURI) {
        try {
            String[] parts = requestURI.split("/");
            if (parts.length > 0) {
                String lastPart = parts[parts.length - 1];
                if (lastPart.matches("\\d+")) {
                    return Long.parseLong(lastPart);
                }
            }
        } catch (Exception e) {
            // Ignore parsing errors
        }
        return null;
    }

    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty() && !"unknown".equalsIgnoreCase(xForwardedFor)) {
            return xForwardedFor.split(",")[0];
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty() && !"unknown".equalsIgnoreCase(xRealIp)) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }

    private String createDetails(HttpServletRequest request, HttpServletResponse response, Exception ex) {
        StringBuilder details = new StringBuilder();
        
        // Add request details
        details.append("Request: ").append(request.getMethod()).append(" ").append(request.getRequestURI());
        
        // Add query parameters if any
        String queryString = request.getQueryString();
        if (queryString != null && !queryString.isEmpty()) {
            details.append("?").append(queryString);
        }
        
        // Add response status
        details.append(" | Response: ").append(response.getStatus());
        
        // Add error details if any
        if (ex != null) {
            details.append(" | Error: ").append(ex.getMessage());
        }
        
        return details.toString();
    }
} 