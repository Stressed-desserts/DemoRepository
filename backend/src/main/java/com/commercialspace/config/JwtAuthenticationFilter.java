package com.commercialspace.config;

import com.commercialspace.util.JwtUtil;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.Collections;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            logger.info("[JWT] Token found in header: {}", token);
            try {
                Claims claims = Jwts.parser()
                        .setSigningKey(JwtUtil.SECRET_KEY.getBytes())
                        .parseClaimsJws(token)
                        .getBody();
                String email = claims.getSubject();
                String role = claims.get("role", String.class);
                Long id = claims.get("id", Long.class);
                logger.info("[JWT] Claims extracted: email={}, role={}, id={}", email, role, id);
                if (email != null && role != null) {
                    UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                            email,
                            null,
                            Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role))
                    );
                    auth.setDetails(id);
                    SecurityContextHolder.getContext().setAuthentication(auth);
                    logger.info("[JWT] Authentication set for user: {} with role: {}", email, role);
                } else {
                    logger.warn("[JWT] Claims missing email or role. Claims: {}", claims);
                }
            } catch (Exception e) {
                logger.error("[JWT] Parsing failed: {}", e.getMessage());
                logger.error("[JWT] Token: {}", token);
            }
        } else {
            logger.warn("[JWT] No valid Bearer token found in Authorization header. Header: {}", header);
        }
        filterChain.doFilter(request, response);
    }
} 