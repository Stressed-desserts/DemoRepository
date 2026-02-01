package com.commercialspace.service;

import com.commercialspace.dto.PropertyRequest;
import com.commercialspace.dto.PropertyResponse;

import java.util.List;

public interface PropertyService {
    PropertyResponse createProperty(PropertyRequest request, String ownerEmail);
    PropertyResponse getPropertyById(Long id);
    List<PropertyResponse> getAllVerifiedProperties();
    List<PropertyResponse> getAllVerifiedProperties(String search);
    List<PropertyResponse> getPropertiesByOwner(String ownerEmail);
    List<PropertyResponse> getAllProperties();
    void setVerified(Long propertyId, boolean verified);
    PropertyResponse verifyProperty(Long propertyId, boolean verified);
}
