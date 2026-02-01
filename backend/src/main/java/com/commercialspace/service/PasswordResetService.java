package com.commercialspace.service;

import com.commercialspace.model.User;
import com.commercialspace.model.PasswordResetToken;
import com.commercialspace.repository.UserRepository;
import com.commercialspace.repository.PasswordResetTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class PasswordResetService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordResetTokenRepository tokenRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JavaMailSender mailSender;

    public String createPasswordResetToken(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) return null;
        User user = userOpt.get();
        // Remove old tokens
        tokenRepository.deleteByUser(user);
        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUser(user);
        resetToken.setExpiryDate(LocalDateTime.now().plusHours(1));
        resetToken.setUsed(false);
        tokenRepository.save(resetToken);
        // Send password reset email
        String resetUrl = "http://localhost:3000/reset-password?token=" + token;
        SimpleMailMessage emailMessage = new SimpleMailMessage();
        emailMessage.setTo(user.getEmail());
        emailMessage.setSubject("Password Reset Request");
        emailMessage.setText("To reset your password, please click the link below:\n" + resetUrl);
        mailSender.send(emailMessage);
        return token;
    }

    public boolean resetPassword(String token, String newPassword) {
        Optional<PasswordResetToken> tokenOpt = tokenRepository.findByToken(token);
        if (tokenOpt.isEmpty()) return false;
        PasswordResetToken resetToken = tokenOpt.get();
        if (resetToken.isUsed() || resetToken.getExpiryDate().isBefore(LocalDateTime.now())) return false;
        User user = resetToken.getUser();
        String encodedPassword = passwordEncoder.encode(newPassword);
        System.out.println("[PasswordResetService] Resetting password for user: " + user.getEmail());
        System.out.println("[PasswordResetService] New encoded password: " + encodedPassword);
        user.setPassword(encodedPassword);
        userRepository.save(user);
        System.out.println("[PasswordResetService] Password updated in DB for user: " + user.getEmail());
        resetToken.setUsed(true);
        tokenRepository.save(resetToken);
        return true;
    }
} 