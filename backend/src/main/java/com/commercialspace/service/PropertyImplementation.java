package com.commercialspace.service;

import com.commercialspace.dto.PropertyRequest;
import com.commercialspace.dto.PropertyResponse;
import com.commercialspace.model.Property;
import com.commercialspace.model.User;
import com.commercialspace.repository.PropertyRepository;
import com.commercialspace.repository.UserRepository;
import com.commercialspace.repository.ReviewRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PropertyImplementation implements PropertyService {

    private static final Logger logger = LoggerFactory.getLogger(PropertyImplementation.class);
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;

    public PropertyImplementation(PropertyRepository propertyRepository, UserRepository userRepository, ReviewRepository reviewRepository) {
        this.propertyRepository = propertyRepository;
        this.userRepository = userRepository;
        this.reviewRepository = reviewRepository;
    }

    @Override
    public List<PropertyResponse> getAllVerifiedProperties() {
        logger.info("Fetching all verified properties from repository");
        List<PropertyResponse> result = propertyRepository.findAll().stream()
                .filter(Property::isVerified)
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        logger.info("{} verified properties fetched", result.size());
        return result;
    }

    @Override
    public List<PropertyResponse> getAllVerifiedProperties(String search) {
        logger.info("Searching verified properties with query: {}", search);
        if (search == null || search.trim().isEmpty()) {
            return getAllVerifiedProperties();
        }
        List<PropertyResponse> result = propertyRepository
            .findByVerifiedTrueAndTitleContainingIgnoreCaseOrVerifiedTrueAndAddressContainingIgnoreCaseOrVerifiedTrueAndStateContainingIgnoreCaseOrVerifiedTrueAndCityContainingIgnoreCaseOrVerifiedTrueAndCountryContainingIgnoreCase(
                search, search, search, search, search)
            .stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
        logger.info("{} verified properties found for search: {}", result.size(), search);
        return result;
    }

    @Override
    public List<PropertyResponse> getAllProperties() {
        logger.info("Fetching all properties (admin)");
        List<PropertyResponse> result = propertyRepository.findAll().stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
        logger.info("{} total properties fetched (admin)", result.size());
        return result;
    }

    @Override
    public PropertyResponse getPropertyById(Long id) {
        logger.info("Fetching property by ID: {}", id);
        Property p = propertyRepository.findById(id).orElseThrow(() -> {
            logger.warn("Property not found for ID: {}", id);
            return new IllegalArgumentException("Property not found");
        });
        logger.info("Property found for ID: {}", id);
        return mapToResponse(p);
    }

    @Override
    public PropertyResponse createProperty(PropertyRequest req, String ownerEmail) {
        logger.info("Creating property for owner: {}", ownerEmail);
        User user = userRepository.findByEmail(ownerEmail).orElseThrow(() -> {
            logger.warn("User not found for email: {}", ownerEmail);
            return new IllegalArgumentException("User not found");
        });
        Property property = new Property();
        property.setTitle(req.getTitle());
        property.setDescription(req.getDescription());
        property.setAddress(req.getAddress());
        property.setState(req.getState());
        property.setCountry(req.getCountry());
        property.setPrice(req.getPrice());
        property.setType(req.getType());
        property.setArea(req.getArea());
        property.setVerified(false);
        property.setOwner(user);
        property.setLatitude(req.getLatitude());
        property.setLongitude(req.getLongitude());
        property.setCity(req.getCity());

        Property saved = propertyRepository.save(property);
        logger.info("Property created with ID: {} for owner: {}", saved.getId(), ownerEmail);
        return mapToResponse(saved);
    }

    @Override
    public List<PropertyResponse> getPropertiesByOwner(String ownerEmail) {
        logger.info("Fetching properties for owner: {}", ownerEmail);
        List<PropertyResponse> result = propertyRepository.findByOwnerEmail(ownerEmail).stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
        logger.info("{} properties fetched for owner: {}", result.size(), ownerEmail);
        return result;
    }

    @Override
    public void setVerified(Long propertyId, boolean verified) {
        Property property = propertyRepository.findById(propertyId).orElseThrow();
        property.setVerified(verified);
        propertyRepository.save(property);
    }

    @Override
    public PropertyResponse verifyProperty(Long propertyId, boolean verified) {
        logger.info("Verifying property ID: {} to status: {}", propertyId, verified);
        Property property = propertyRepository.findById(propertyId).orElseThrow(() -> {
            logger.warn("Property not found for verification ID: {}", propertyId);
            return new IllegalArgumentException("Property not found");
        });
        property.setVerified(verified);
        Property saved = propertyRepository.save(property);
        logger.info("Property {} verification status updated to: {}", propertyId, verified);
        return mapToResponse(saved);
    }

    private PropertyResponse mapToResponse(Property p) {
        PropertyResponse res = new PropertyResponse();
        res.setId(p.getId());
        res.setTitle(p.getTitle());
        res.setDescription(p.getDescription());
        res.setAddress(p.getAddress());
        res.setState(p.getState());
        res.setCountry(p.getCountry());
        res.setPrice(p.getPrice().doubleValue());
        res.setVerified(p.isVerified());
        res.setOwnerEmail(p.getOwner().getEmail());
        res.setOwnerName(p.getOwner().getName());
        res.setType(p.getType());
        res.setArea(p.getArea());
        res.setLatitude(p.getLatitude());
        res.setLongitude(p.getLongitude());
        res.setCity(p.getCity());
        // Set review stats
        long reviewCount = reviewRepository.countByPropertyId(p.getId());
        Double avg = null;
        try {
            avg = (Double) reviewRepository
                .findByPropertyId(p.getId())
                .stream()
                .mapToInt(r -> r.getRating())
                .average()
                .orElse(0.0);
        } catch (Exception e) {
            avg = 0.0;
        }
        res.setReviewCount((int) reviewCount);
        res.setAverageRating(avg);
        res.setPhotoUrl(p.getPhotoUrl());
        return res;
    }
}
