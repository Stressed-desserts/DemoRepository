package com.commercialspace.service;

import com.commercialspace.model.Booking;
import com.commercialspace.model.Property;
import com.commercialspace.model.User;
import com.commercialspace.repository.BookingRepository;
import com.commercialspace.repository.PropertyRepository;
import com.commercialspace.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class RealTimeAnalyticsService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    public void broadcastAnalyticsUpdate() {
        Map<String, Object> analytics = getRealTimeAnalytics();
        messagingTemplate.convertAndSend("/topic/analytics", analytics);
    }

    public void broadcastBookingUpdate(Booking booking) {
        Map<String, Object> bookingUpdate = new HashMap<>();
        bookingUpdate.put("type", "booking");
        bookingUpdate.put("data", booking);
        bookingUpdate.put("timestamp", LocalDateTime.now());
        messagingTemplate.convertAndSend("/topic/analytics", bookingUpdate);
    }

    public void broadcastPropertyUpdate(Property property) {
        Map<String, Object> propertyUpdate = new HashMap<>();
        propertyUpdate.put("type", "property");
        propertyUpdate.put("data", property);
        propertyUpdate.put("timestamp", LocalDateTime.now());
        messagingTemplate.convertAndSend("/topic/analytics", propertyUpdate);
    }

    public void broadcastUserUpdate(User user) {
        Map<String, Object> userUpdate = new HashMap<>();
        userUpdate.put("type", "user");
        userUpdate.put("data", user);
        userUpdate.put("timestamp", LocalDateTime.now());
        messagingTemplate.convertAndSend("/topic/analytics", userUpdate);
    }

    private Map<String, Object> getRealTimeAnalytics() {
        Map<String, Object> analytics = new HashMap<>();
        
        // Real-time counts
        long totalProperties = propertyRepository.count();
        long totalBookings = bookingRepository.count();
        long totalUsers = userRepository.count();
        
        // Recent activity (last 24 hours)
        LocalDateTime yesterday = LocalDateTime.now().minusDays(1);
        long recentBookings = bookingRepository.findAll().stream()
            .filter(b -> b.getCreatedAt().isAfter(yesterday))
            .count();
        
        // Note: Property model doesn't have createdAt field, so we'll use total properties for now
        long recentProperties = 0; // Placeholder for future implementation
        
        analytics.put("totalProperties", totalProperties);
        analytics.put("totalBookings", totalBookings);
        analytics.put("totalUsers", totalUsers);
        analytics.put("recentBookings", recentBookings);
        analytics.put("recentProperties", recentProperties);
        analytics.put("timestamp", LocalDateTime.now());
        
        return analytics;
    }
}
