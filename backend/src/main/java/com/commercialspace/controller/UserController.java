package com.commercialspace.controller;

import com.commercialspace.dto.UserResponse;
import com.commercialspace.dto.UserUpdateRequest;
import com.commercialspace.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;

@RestController
@RequestMapping("/api/users")
@Tag(name = "User", description = "User management APIs")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    @Operation(summary = "Get current user profile")
    public ResponseEntity<UserResponse> getCurrentUser(Principal principal) {
        String email = principal.getName();
        logger.info("Fetching user profile for email: {}", email);
        try {
        UserResponse userResponse = userService.getCurrentUser(email);
            logger.info("User profile fetched for email: {}", email);
        return ResponseEntity.ok(userResponse);
        } catch (Exception ex) {
            logger.error("Error fetching user profile for email: {}", email, ex);
            return ResponseEntity.status(404).build();
        }
    }

    @PutMapping("/me")
    @Operation(summary = "Update current user profile")
    public ResponseEntity<UserResponse> updateCurrentUser(Principal principal, @RequestBody UserUpdateRequest updateRequest) {
        String email = principal.getName();
        logger.info("Updating user profile for email: {}", email);
        try {
        UserResponse userResponse = userService.updateUser(email, updateRequest);
            logger.info("User profile updated for email: {}", email);
        return ResponseEntity.ok(userResponse);
        } catch (Exception ex) {
            logger.error("Error updating user profile for email: {}", email, ex);
            return ResponseEntity.status(500).build();
        }
    }
}
