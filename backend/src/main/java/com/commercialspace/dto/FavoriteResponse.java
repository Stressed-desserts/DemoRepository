package com.commercialspace.dto;

import java.time.LocalDateTime;

public class FavoriteResponse {
    private Long id;
    private Long propertyId;
    private String propertyTitle;
    private String propertyLocation;
    private LocalDateTime createdAt;

    public FavoriteResponse(Long id, Long propertyId, String propertyTitle, String propertyLocation, LocalDateTime createdAt) {
        this.id = id;
        this.propertyId = propertyId;
        this.propertyTitle = propertyTitle;
        this.propertyLocation = propertyLocation;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public Long getPropertyId() { return propertyId; }
    public String getPropertyTitle() { return propertyTitle; }
    public String getPropertyLocation() { return propertyLocation; }
    public LocalDateTime getCreatedAt() { return createdAt; }
} 