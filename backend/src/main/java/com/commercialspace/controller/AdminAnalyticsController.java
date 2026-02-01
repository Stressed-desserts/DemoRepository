package com.commercialspace.controller;

import com.commercialspace.service.AdminAnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/analytics")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminAnalyticsController {

    @Autowired
    private AdminAnalyticsService analyticsService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAnalytics(@RequestParam(defaultValue = "30") int days) {
        Map<String, Object> analytics = analyticsService.getAnalytics(days);
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/properties")
    public ResponseEntity<Map<String, Object>> getPropertyAnalytics(@RequestParam(defaultValue = "30") int days) {
        Map<String, Object> propertyAnalytics = analyticsService.getPropertyAnalytics(days);
        return ResponseEntity.ok(propertyAnalytics);
    }

    @GetMapping("/bookings")
    public ResponseEntity<Map<String, Object>> getBookingAnalytics(@RequestParam(defaultValue = "30") int days) {
        Map<String, Object> bookingAnalytics = analyticsService.getBookingAnalytics(days);
        return ResponseEntity.ok(bookingAnalytics);
    }

    @GetMapping("/revenue")
    public ResponseEntity<Map<String, Object>> getRevenueAnalytics(@RequestParam(defaultValue = "30") int days) {
        Map<String, Object> revenueAnalytics = analyticsService.getRevenueAnalytics(days);
        return ResponseEntity.ok(revenueAnalytics);
    }

    @GetMapping("/users")
    public ResponseEntity<Map<String, Object>> getUserAnalytics(@RequestParam(defaultValue = "30") int days) {
        Map<String, Object> userAnalytics = analyticsService.getUserAnalytics(days);
        return ResponseEntity.ok(userAnalytics);
    }
}
