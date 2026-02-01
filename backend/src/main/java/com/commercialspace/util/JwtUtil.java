package com.commercialspace.util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.Date;
import com.commercialspace.model.User;

public class JwtUtil {
    // Secure 512-bit (64-byte) key for HS512
    public static final String SECRET_KEY = "Qw8e2nV7pL4zX1rT6bJ9sK3yH5uG0cF2aM8dS7qW4vE1tZ6oP3lB0xN5jR2hC9fU8";
    private static final long EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 7; // 7 days

    public static String generateToken(User user) {
        return Jwts.builder()
            .setSubject(user.getEmail())
            .claim("role", user.getRole().name())
            .claim("id", user.getId())
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
            .signWith(SignatureAlgorithm.HS512, SECRET_KEY.getBytes())
            .compact();
    }
} 