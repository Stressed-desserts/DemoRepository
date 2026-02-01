package com.commercialspace.controller;

import com.commercialspace.dto.LoginRequest;
import com.commercialspace.dto.SignupRequest;
import com.commercialspace.dto.UserResponse;
import com.commercialspace.service.UserService;
import com.commercialspace.util.JwtUtil;
import com.commercialspace.dto.AuthResponse;
import com.commercialspace.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.commercialspace.dto.ForgotPasswordRequest;
import com.commercialspace.dto.ResetPasswordRequest;
import com.commercialspace.service.PasswordResetService;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Authentication management APIs (No JWT)")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    private final UserService userService;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private PasswordResetService passwordResetService;

    @Autowired
    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping(value = "/signup", produces = "application/json")
    @Operation(summary = "Register a new user (No JWT)")
    public ResponseEntity<UserResponse> registerUser(@Valid @RequestBody SignupRequest signupRequest) {
        UserResponse userResponse = userService.createUser(signupRequest);
        return ResponseEntity.ok(userResponse);
    }

    @PostMapping("/login")
    @Operation(summary = "Login user (returns JWT)")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            logger.info("Login attempt for email: {}", loginRequest.getEmail());
            User user = userService.findByEmail(loginRequest.getEmail());
            System.out.println("[AuthController] Login attempt for email: " + loginRequest.getEmail());
            System.out.println("[AuthController] Raw password: " + loginRequest.getPassword());
            System.out.println("[AuthController] Encoded password in DB: " + user.getPassword());
            boolean matches = passwordEncoder.matches(loginRequest.getPassword(), user.getPassword());
            System.out.println("[AuthController] Password matches: " + matches);
            if (user != null && matches) {
                if (user.getEmail() == null || user.getRole() == null || user.getId() == null) {
                    logger.error("User data incomplete for email: {}", loginRequest.getEmail());
                    return ResponseEntity.status(500).body(java.util.Collections.singletonMap("message", "User data incomplete"));
                }
                String token = JwtUtil.generateToken(user);
                AuthResponse response = new AuthResponse(token, user);
                logger.info("Login successful for email: {}", loginRequest.getEmail());
                return ResponseEntity.ok(response);
        } else {
                logger.warn("Invalid credentials for email: {}", loginRequest.getEmail());
                return ResponseEntity.status(401).body(java.util.Collections.singletonMap("message", "Invalid credentials"));
        }
        } catch (IllegalArgumentException ex) {
            logger.warn("Illegal argument during login for email: {}: {}", loginRequest.getEmail(), ex.getMessage());
            return ResponseEntity.badRequest().body(java.util.Collections.singletonMap("message", ex.getMessage()));
        } catch (Exception ex) {
            logger.error("Internal server error during login for email: {}", loginRequest.getEmail(), ex);
            return ResponseEntity.status(500).body(java.util.Collections.singletonMap("message", "Internal server error: " + ex.getMessage()));
        }
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Request password reset (sends email with link)")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        String token = passwordResetService.createPasswordResetToken(request.getEmail());
        if (token == null) {
            return ResponseEntity.badRequest().body(java.util.Collections.singletonMap("message", "User not found"));
        }
        // In dev, the link is logged to the backend console
        return ResponseEntity.ok(java.util.Collections.singletonMap("message", "If your email exists, a reset link has been sent."));
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Reset password using token")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        boolean success = passwordResetService.resetPassword(request.getToken(), request.getNewPassword());
        if (success) {
            return ResponseEntity.ok(java.util.Collections.singletonMap("message", "Password reset successful"));
        } else {
            return ResponseEntity.badRequest().body(java.util.Collections.singletonMap("message", "Invalid or expired token"));
        }
    }
}

@RestControllerAdvice
class GlobalExceptionHandler {
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<?> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(java.util.Collections.singletonMap("message", ex.getMessage()));
    }
}
