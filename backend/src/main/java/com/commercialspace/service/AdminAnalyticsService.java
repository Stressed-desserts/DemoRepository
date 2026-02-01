package com.commercialspace.service;

import com.commercialspace.model.*;
import com.commercialspace.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminAnalyticsService {

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    public Map<String, Object> getAnalytics(int days) {
        LocalDate startDate = LocalDate.now().minusDays(days);
        
        Map<String, Object> analytics = new HashMap<>();
        analytics.put("properties", getPropertyAnalytics(days));
        analytics.put("bookings", getBookingAnalytics(days));
        analytics.put("users", getUserAnalytics(days));
        analytics.put("revenue", getRevenueAnalytics(days));
        
        return analytics;
    }

    public Map<String, Object> getPropertyAnalytics(int days) {
        LocalDate startDate = LocalDate.now().minusDays(days);
        
        List<Property> allProperties = propertyRepository.findAll();
        
        // Property counts
        long totalProperties = allProperties.size();
        long verifiedProperties = allProperties.stream().filter(Property::isVerified).count();
        long pendingProperties = totalProperties - verifiedProperties;
        
        // Properties by type
        Map<PropertyType, Long> propertiesByType = allProperties.stream()
            .collect(Collectors.groupingBy(Property::getType, Collectors.counting()));
        
        List<Map<String, Object>> byType = propertiesByType.entrySet().stream()
            .map(entry -> {
                Map<String, Object> typeData = new HashMap<>();
                typeData.put("type", entry.getKey().toString());
                typeData.put("count", entry.getValue());
                return typeData;
            })
            .collect(Collectors.toList());
        
        // Properties by location
        Map<String, Long> propertiesByLocation = allProperties.stream()
            .filter(p -> p.getCity() != null && !p.getCity().isEmpty())
            .collect(Collectors.groupingBy(Property::getCity, Collectors.counting()));
        
        List<Map<String, Object>> byLocation = propertiesByLocation.entrySet().stream()
            .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
            .limit(10)
            .map(entry -> {
                Map<String, Object> locationData = new HashMap<>();
                locationData.put("city", entry.getKey());
                locationData.put("count", entry.getValue());
                return locationData;
            })
            .collect(Collectors.toList());
        
        Map<String, Object> propertyAnalytics = new HashMap<>();
        propertyAnalytics.put("total", totalProperties);
        propertyAnalytics.put("verified", verifiedProperties);
        propertyAnalytics.put("pending", pendingProperties);
        propertyAnalytics.put("byType", byType);
        propertyAnalytics.put("byLocation", byLocation);
        
        return propertyAnalytics;
    }

    public Map<String, Object> getBookingAnalytics(int days) {
        LocalDate startDate = LocalDate.now().minusDays(days);
        
        List<Booking> allBookings = bookingRepository.findAll();
        
        // Booking counts
        long totalBookings = allBookings.size();
        long pendingBookings = allBookings.stream().filter(b -> "PENDING".equals(b.getStatus())).count();
        long acceptedBookings = allBookings.stream().filter(b -> "ACCEPTED".equals(b.getStatus())).count();
        long rejectedBookings = allBookings.stream().filter(b -> "REJECTED".equals(b.getStatus())).count();
        
        // Monthly booking data
        List<Map<String, Object>> monthlyData = new ArrayList<>();
        DateTimeFormatter monthFormatter = DateTimeFormatter.ofPattern("MMM yyyy");
        
        for (int i = 11; i >= 0; i--) {
            LocalDate monthStart = LocalDate.now().minusMonths(i).withDayOfMonth(1);
            LocalDate monthEnd = monthStart.plusMonths(1).minusDays(1);
            
            List<Booking> monthBookings = allBookings.stream()
                .filter(b -> {
                    LocalDate bookingDate = b.getCreatedAt().toLocalDate();
                    return !bookingDate.isBefore(monthStart) && !bookingDate.isAfter(monthEnd);
                })
                .collect(Collectors.toList());
            
            double monthRevenue = monthBookings.stream()
                .filter(b -> "ACCEPTED".equals(b.getStatus()))
                .mapToDouble(b -> b.getTotalPrice())
                .sum();
            
            Map<String, Object> monthData = new HashMap<>();
            monthData.put("month", monthStart.format(monthFormatter));
            monthData.put("count", monthBookings.size());
            monthData.put("revenue", monthRevenue);
            monthlyData.add(monthData);
        }
        
        Map<String, Object> bookingAnalytics = new HashMap<>();
        bookingAnalytics.put("total", totalBookings);
        bookingAnalytics.put("pending", pendingBookings);
        bookingAnalytics.put("accepted", acceptedBookings);
        bookingAnalytics.put("rejected", rejectedBookings);
        bookingAnalytics.put("monthly", monthlyData);
        
        return bookingAnalytics;
    }

    public Map<String, Object> getUserAnalytics(int days) {
        LocalDate startDate = LocalDate.now().minusDays(days);
        
        List<User> allUsers = userRepository.findAll();
        
        // User counts by role
        long totalUsers = allUsers.size();
        long customers = allUsers.stream().filter(u -> User.Role.CUSTOMER.equals(u.getRole())).count();
        long owners = allUsers.stream().filter(u -> User.Role.OWNER.equals(u.getRole())).count();
        long admins = allUsers.stream().filter(u -> User.Role.ADMIN.equals(u.getRole())).count();
        
        // User growth over time - simplified since User doesn't have createdAt
        List<Map<String, Object>> growthData = new ArrayList<>();
        DateTimeFormatter monthFormatter = DateTimeFormatter.ofPattern("MMM yyyy");
        
        // For now, we'll use a simple distribution since we don't have creation dates
        for (int i = 11; i >= 0; i--) {
            LocalDate monthStart = LocalDate.now().minusMonths(i).withDayOfMonth(1);
            
            Map<String, Object> monthData = new HashMap<>();
            monthData.put("month", monthStart.format(monthFormatter));
            monthData.put("count", Math.max(1, totalUsers / 12)); // Simple distribution
            growthData.add(monthData);
        }
        
        Map<String, Object> userAnalytics = new HashMap<>();
        userAnalytics.put("total", totalUsers);
        userAnalytics.put("customers", customers);
        userAnalytics.put("owners", owners);
        userAnalytics.put("admins", admins);
        userAnalytics.put("growth", growthData);
        
        return userAnalytics;
    }

    public Map<String, Object> getRevenueAnalytics(int days) {
        LocalDate startDate = LocalDate.now().minusDays(days);
        
        List<Booking> allBookings = bookingRepository.findAll();
        
        // Total revenue
        double totalRevenue = allBookings.stream()
            .filter(b -> "ACCEPTED".equals(b.getStatus()))
            .mapToDouble(b -> b.getTotalPrice())
            .sum();
        
        // Monthly revenue
        double monthlyRevenue = allBookings.stream()
            .filter(b -> "ACCEPTED".equals(b.getStatus()) && 
                        b.getCreatedAt().isAfter(LocalDateTime.now().minusMonths(1)))
            .mapToDouble(b -> b.getTotalPrice())
            .sum();
        
        // Average revenue per booking
        double averageRevenue = allBookings.stream()
            .filter(b -> "ACCEPTED".equals(b.getStatus()))
            .mapToDouble(b -> b.getTotalPrice())
            .average()
            .orElse(0.0);
        
        // Revenue by property type
        Map<PropertyType, Double> revenueByType = allBookings.stream()
            .filter(b -> "ACCEPTED".equals(b.getStatus()) && b.getProperty() != null)
            .collect(Collectors.groupingBy(
                b -> b.getProperty().getType(),
                Collectors.summingDouble(Booking::getTotalPrice)
            ));
        
        List<Map<String, Object>> byPropertyType = revenueByType.entrySet().stream()
            .map(entry -> {
                Map<String, Object> typeData = new HashMap<>();
                typeData.put("type", entry.getKey().toString());
                typeData.put("revenue", entry.getValue());
                return typeData;
            })
            .collect(Collectors.toList());
        
        Map<String, Object> revenueAnalytics = new HashMap<>();
        revenueAnalytics.put("total", totalRevenue);
        revenueAnalytics.put("monthly", monthlyRevenue);
        revenueAnalytics.put("average", averageRevenue);
        revenueAnalytics.put("byPropertyType", byPropertyType);
        
        return revenueAnalytics;
    }
}
