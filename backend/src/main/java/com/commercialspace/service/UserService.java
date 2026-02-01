package com.commercialspace.service;

import com.commercialspace.dto.SignupRequest;
import com.commercialspace.dto.UserResponse;
import com.commercialspace.dto.UserUpdateRequest;
import com.commercialspace.model.User;
import com.commercialspace.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, ModelMapper modelMapper) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.modelMapper = modelMapper;
    }

    public UserResponse createUser(SignupRequest signupRequest) {
        logger.info("Creating user with email: {}", signupRequest.getEmail());
        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            logger.warn("User already exists with email: {}", signupRequest.getEmail());
            throw new IllegalArgumentException("User already exists with email: " + signupRequest.getEmail());
        }

        User user = new User();
        user.setName(signupRequest.getName());
        user.setEmail(signupRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
        user.setRole(signupRequest.getRole());

        
    
        User savedUser = userRepository.save(user);
        logger.info("User created with email: {} and ID: {}", savedUser.getEmail(), savedUser.getId());
        return modelMapper.map(savedUser, UserResponse.class);
        
        
    }
    
    public boolean validateUser(String email, String password) {
        logger.info("Validating user with email: {}", email);
        boolean valid = userRepository.findByEmail(email)
                .map(user -> passwordEncoder.matches(password, user.getPassword()))
                .orElse(false);
        if (valid) {
            logger.info("User validated for email: {}", email);
        } else {
            logger.warn("User validation failed for email: {}", email);
        }
        return valid;
    }

    public UserResponse getCurrentUser(String email) {
        logger.info("Fetching current user for email: {}", email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    logger.warn("User not found for email: {}", email);
                    return new IllegalArgumentException("User not found with email: " + email);
                });
        logger.info("User found for email: {}", email);
        return modelMapper.map(user, UserResponse.class);
    }

    public User findByEmail(String email) {
        logger.info("Finding user by email: {}", email);
        return userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    logger.warn("User not found for email: {}", email);
                    return new IllegalArgumentException("User not found with email: " + email);
                });
    }

    public UserResponse updateUser(String email, UserUpdateRequest updateRequest) {
        logger.info("Updating user for email: {}", email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    logger.warn("User not found for email: {}", email);
                    return new IllegalArgumentException("User not found with email: " + email);
                });
        if (updateRequest.getName() != null && !updateRequest.getName().isEmpty()) {
            user.setName(updateRequest.getName());
        }
        if (updateRequest.getPassword() != null && !updateRequest.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(updateRequest.getPassword()));
        }
        User savedUser = userRepository.save(user);
        logger.info("User updated for email: {}", email);
        return modelMapper.map(savedUser, UserResponse.class);
    }
}
