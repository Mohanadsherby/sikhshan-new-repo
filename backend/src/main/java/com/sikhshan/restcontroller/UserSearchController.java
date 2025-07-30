package com.sikhshan.restcontroller;

import com.sikhshan.dto.UserSearchRequest;
import com.sikhshan.dto.UserSearchResponse;
import com.sikhshan.service.UserSearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/users/search")
@CrossOrigin(origins = "*")
public class UserSearchController {
    
    private static final Logger logger = LoggerFactory.getLogger(UserSearchController.class);
    
    @Autowired
    private UserSearchService userSearchService;
    
    @PostMapping
    public ResponseEntity<UserSearchResponse> searchUsers(@RequestBody UserSearchRequest request) {
        try {
            logger.info("Searching users with request: {}", request);
            UserSearchResponse response = userSearchService.searchUsers(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error searching users: ", e);
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping
    public ResponseEntity<UserSearchResponse> searchUsersGet(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String role,
            @RequestParam Long currentUserId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            logger.info("Searching users with GET params: query={}, role={}, currentUserId={}, page={}, size={}", 
                       query, role, currentUserId, page, size);
            UserSearchRequest request = new UserSearchRequest(query, role, currentUserId, page, size);
            UserSearchResponse response = userSearchService.searchUsers(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error searching users with GET: ", e);
            return ResponseEntity.badRequest().build();
        }
    }
} 