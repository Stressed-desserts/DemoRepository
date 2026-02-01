package com.commercialspace.controller;

import com.commercialspace.dto.PropertyRequest;
import com.commercialspace.dto.PropertyResponse;
import com.commercialspace.service.PropertyService;
import com.commercialspace.dto.ReviewRequest;
import com.commercialspace.dto.ReviewResponse;
import com.commercialspace.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/properties")
@Tag(name = "Property", description = "Property management APIs")
public class PropertyController {

    private static final Logger logger = LoggerFactory.getLogger(PropertyController.class);
    private final PropertyService propertyService;
    private final ReviewService reviewService;

    public PropertyController(PropertyService propertyService, ReviewService reviewService) {
        this.propertyService = propertyService;
        this.reviewService = reviewService;
    }

    @GetMapping
    @Operation(summary = "Get all verified properties (public)")
    public ResponseEntity<List<PropertyResponse>> getAllVerifiedProperties(@RequestParam(value = "search", required = false) String search) {
        logger.info("Fetching all verified properties{}", search != null ? " with search: " + search : "");
        List<PropertyResponse> properties = propertyService.getAllVerifiedProperties(search);
        logger.info("Fetched {} properties", properties.size());
        return ResponseEntity.ok(properties);
    }

    @GetMapping("/all")
    @Operation(summary = "Get all properties (ADMIN only)")
    public ResponseEntity<List<PropertyResponse>> getAllProperties() {
        logger.info("Fetching all properties (admin)");
        List<PropertyResponse> properties = propertyService.getAllProperties();
        logger.info("Fetched {} total properties (admin)", properties.size());
        return ResponseEntity.ok(properties);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get property by ID")
    public ResponseEntity<PropertyResponse> getPropertyById(@PathVariable Long id) {
        logger.info("Fetching property by ID: {}", id);
        try {
        PropertyResponse property = propertyService.getPropertyById(id);
            logger.info("Property found for ID: {}", id);
        return ResponseEntity.ok(property);
        } catch (Exception ex) {
            logger.error("Error fetching property by ID: {}", id, ex);
            return ResponseEntity.status(404).build();
        }
    }

    @GetMapping("/my-properties")
    @Operation(summary = "Get all properties for the current owner")
    public ResponseEntity<List<PropertyResponse>> getMyProperties(java.security.Principal principal) {
        String ownerEmail = principal.getName();
        List<PropertyResponse> properties = propertyService.getPropertiesByOwner(ownerEmail);
        return ResponseEntity.ok(properties);
    }

    @PostMapping
    @Operation(summary = "Create new property (OWNER only)")
    public ResponseEntity<PropertyResponse> createProperty(
            @Valid @RequestBody PropertyRequest propertyRequest,
            java.security.Principal principal) {
        String ownerEmail = principal.getName();
        logger.info("Creating property for owner: {}", ownerEmail);
        try {
        PropertyResponse property = propertyService.createProperty(propertyRequest, ownerEmail);
            logger.info("Property created for owner: {}", ownerEmail);
        return ResponseEntity.ok(property);
        } catch (Exception ex) {
            logger.error("Error creating property for owner: {}", ownerEmail, ex);
            return ResponseEntity.status(500).build();
        }
    }

    @PatchMapping("/{id}/verify")
    @Operation(summary = "Verify/unverify a property (ADMIN only)")
    public ResponseEntity<PropertyResponse> verifyProperty(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> request,
            java.security.Principal principal) {
        logger.info("Verifying property ID: {} by admin: {}", id, principal.getName());
        try {
            Boolean verified = request.get("verified");
            if (verified == null) {
                return ResponseEntity.badRequest().build();
            }
            PropertyResponse property = propertyService.verifyProperty(id, verified);
            logger.info("Property {} verification status updated to: {}", id, verified);
            return ResponseEntity.ok(property);
        } catch (Exception ex) {
            logger.error("Error verifying property ID: {}", id, ex);
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/{id}/reviews")
    @Operation(summary = "Get all reviews for a property")
    public ResponseEntity<List<ReviewResponse>> getReviews(@PathVariable Long id) {
        return ResponseEntity.ok(reviewService.getReviewsForProperty(id));
    }

    @PostMapping("/{id}/reviews")
    @Operation(summary = "Add a review to a property (authenticated)")
    public ResponseEntity<ReviewResponse> addReview(@PathVariable Long id, @RequestBody ReviewRequest request, java.security.Principal principal) {
        String userEmail = principal.getName();
        ReviewResponse review = reviewService.addReview(id, userEmail, request);
        return ResponseEntity.ok(review);
    }
}
