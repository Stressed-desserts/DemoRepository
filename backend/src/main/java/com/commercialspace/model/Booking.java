package com.commercialspace.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id")
    @com.fasterxml.jackson.annotation.JsonManagedReference
    private Property property;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    @com.fasterxml.jackson.annotation.JsonManagedReference
    private User customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    @com.fasterxml.jackson.annotation.JsonManagedReference
    private User owner;

    @JsonProperty("start_date")
    private LocalDate startDate;
    
    @JsonProperty("end_date")
    private LocalDate endDate;

    @Column(nullable = false)
    private String status; // PENDING, ACCEPTED, REJECTED

    @JsonProperty("created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    // Calculate total price based on monthly rate and duration
    @JsonProperty("total_price")
    public Double getTotalPrice() {
        if (startDate == null || endDate == null || property == null) {
            return 0.0;
        }
        long days = ChronoUnit.DAYS.between(startDate, endDate) + 1; // Include both start and end dates
        // Calculate months (including partial months)
        double months = Math.ceil(days / 30.0); // Round up to the nearest month
        return property.getPrice().multiply(java.math.BigDecimal.valueOf(months)).doubleValue();
    }

    // Calculate number of days
    @JsonProperty("days")
    public Long getDays() {
        if (startDate == null || endDate == null) {
            return 0L;
        }
        return ChronoUnit.DAYS.between(startDate, endDate) + 1; // Include both start and end dates
    }

    // Calculate number of months (for display)
    @JsonProperty("months")
    public Double getMonths() {
        if (startDate == null || endDate == null) {
            return 0.0;
        }
        long days = ChronoUnit.DAYS.between(startDate, endDate) + 1;
        return Math.ceil(days / 30.0); // Round up to the nearest month
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Property getProperty() { return property; }
    public void setProperty(Property property) { this.property = property; }
    public User getCustomer() { return customer; }
    public void setCustomer(User customer) { this.customer = customer; }
    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
} 