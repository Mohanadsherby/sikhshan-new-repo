package com.sikhshan.service;

import com.sikhshan.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class ManualAuditLogService {

    @Autowired
    private AuditLogService auditLogService;

    /**
     * Log user login
     */
    public void logUserLogin(User user, HttpServletRequest request, boolean success) {
        String status = success ? "SUCCESS" : "ERROR";
        String details = success ? "User logged in successfully" : "Login failed";
        
        auditLogService.createLog(
            user,
            "LOGIN",
            details,
            status,
            getClientIpAddress(request),
            request.getHeader("User-Agent"),
            "USER",
            user != null ? user.getId() : null,
            null, null, null, "POST", "/api/auth/login",
            success ? 200 : 401, null, null
        );
    }

    /**
     * Log user logout
     */
    public void logUserLogout(User user, HttpServletRequest request) {
        auditLogService.createLog(
            user,
            "LOGOUT",
            "User logged out",
            "SUCCESS",
            getClientIpAddress(request),
            request.getHeader("User-Agent"),
            "USER",
            user != null ? user.getId() : null,
            null, null, null, "POST", "/api/auth/logout",
            200, null, null
        );
    }

    /**
     * Log course creation
     */
    public void logCourseCreation(User user, String courseName, Long courseId, HttpServletRequest request) {
        auditLogService.createLog(
            user,
            "CREATE_COURSE",
            "Created course: " + courseName,
            "SUCCESS",
            getClientIpAddress(request),
            request.getHeader("User-Agent"),
            "COURSE",
            courseId,
            null, null, null, "POST", "/api/courses",
            201, null, null
        );
    }

    /**
     * Log course update
     */
    public void logCourseUpdate(User user, String courseName, Long courseId, String oldValues, String newValues, HttpServletRequest request) {
        auditLogService.createLog(
            user,
            "UPDATE_COURSE",
            "Updated course: " + courseName,
            "SUCCESS",
            getClientIpAddress(request),
            request.getHeader("User-Agent"),
            "COURSE",
            courseId,
            oldValues, newValues, null, "PUT", "/api/courses",
            200, null, null
        );
    }

    /**
     * Log assignment creation
     */
    public void logAssignmentCreation(User user, String assignmentTitle, Long assignmentId, Long courseId, HttpServletRequest request) {
        auditLogService.createLog(
            user,
            "CREATE_ASSIGNMENT",
            "Created assignment: " + assignmentTitle + " in course ID: " + courseId,
            "SUCCESS",
            getClientIpAddress(request),
            request.getHeader("User-Agent"),
            "ASSIGNMENT",
            assignmentId,
            null, null, null, "POST", "/api/assignments",
            201, null, null
        );
    }

    /**
     * Log assignment submission
     */
    public void logAssignmentSubmission(User user, String assignmentTitle, Long assignmentId, HttpServletRequest request) {
        auditLogService.createLog(
            user,
            "SUBMIT_ASSIGNMENT",
            "Submitted assignment: " + assignmentTitle,
            "SUCCESS",
            getClientIpAddress(request),
            request.getHeader("User-Agent"),
            "ASSIGNMENT",
            assignmentId,
            null, null, null, "POST", "/api/assignments/submit",
            200, null, null
        );
    }

    /**
     * Log quiz creation
     */
    public void logQuizCreation(User user, String quizTitle, Long quizId, Long courseId, HttpServletRequest request) {
        auditLogService.createLog(
            user,
            "CREATE_QUIZ",
            "Created quiz: " + quizTitle + " in course ID: " + courseId,
            "SUCCESS",
            getClientIpAddress(request),
            request.getHeader("User-Agent"),
            "QUIZ",
            quizId,
            null, null, null, "POST", "/api/quizzes",
            201, null, null
        );
    }

    /**
     * Log quiz attempt
     */
    public void logQuizAttempt(User user, String quizTitle, Long quizId, int score, HttpServletRequest request) {
        auditLogService.createLog(
            user,
            "TAKE_QUIZ",
            "Attempted quiz: " + quizTitle + " with score: " + score,
            "SUCCESS",
            getClientIpAddress(request),
            request.getHeader("User-Agent"),
            "QUIZ",
            quizId,
            null, null, null, "POST", "/api/quizzes/attempt",
            200, null, null
        );
    }

    /**
     * Log file upload
     */
    public void logFileUpload(User user, String fileName, String fileType, Long fileId, HttpServletRequest request) {
        auditLogService.createLog(
            user,
            "UPLOAD_FILE",
            "Uploaded file: " + fileName + " (Type: " + fileType + ")",
            "SUCCESS",
            getClientIpAddress(request),
            request.getHeader("User-Agent"),
            "FILE",
            fileId,
            null, null, null, "POST", "/api/files/upload",
            200, null, null
        );
    }

    /**
     * Log course enrollment
     */
    public void logCourseEnrollment(User user, String courseName, Long courseId, HttpServletRequest request) {
        auditLogService.createLog(
            user,
            "ENROLL_COURSE",
            "Enrolled in course: " + courseName,
            "SUCCESS",
            getClientIpAddress(request),
            request.getHeader("User-Agent"),
            "COURSE",
            courseId,
            null, null, null, "POST", "/api/courses/enroll",
            200, null, null
        );
    }

    /**
     * Log course unenrollment
     */
    public void logCourseUnenrollment(User user, String courseName, Long courseId, HttpServletRequest request) {
        auditLogService.createLog(
            user,
            "UNENROLL_COURSE",
            "Unenrolled from course: " + courseName,
            "SUCCESS",
            getClientIpAddress(request),
            request.getHeader("User-Agent"),
            "COURSE",
            courseId,
            null, null, null, "DELETE", "/api/courses/enroll",
            200, null, null
        );
    }

    /**
     * Log password change
     */
    public void logPasswordChange(User user, HttpServletRequest request) {
        auditLogService.createLog(
            user,
            "PASSWORD_CHANGE",
            "Password changed successfully",
            "SUCCESS",
            getClientIpAddress(request),
            request.getHeader("User-Agent"),
            "USER",
            user.getId(),
            null, null, null, "PUT", "/api/users/password",
            200, null, null
        );
    }

    /**
     * Log profile update
     */
    public void logProfileUpdate(User user, String oldValues, String newValues, HttpServletRequest request) {
        auditLogService.createLog(
            user,
            "PROFILE_UPDATE",
            "Profile updated",
            "SUCCESS",
            getClientIpAddress(request),
            request.getHeader("User-Agent"),
            "USER",
            user.getId(),
            oldValues, newValues, null, "PUT", "/api/users/profile",
            200, null, null
        );
    }

    /**
     * Log error
     */
    public void logError(User user, String action, String errorMessage, HttpServletRequest request) {
        auditLogService.createLog(
            user,
            action,
            "Error occurred: " + errorMessage,
            "ERROR",
            getClientIpAddress(request),
            request.getHeader("User-Agent"),
            "SYSTEM",
            null,
            null, null, null, request.getMethod(), request.getRequestURI(),
            500, null, errorMessage
        );
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
} 