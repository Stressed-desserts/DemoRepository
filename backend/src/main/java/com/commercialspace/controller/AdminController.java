package com.commercialspace.controller;

import com.commercialspace.dto.PropertyResponse;
import com.commercialspace.service.PropertyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Admin", description = "Admin management APIs")
public class AdminController {

    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);
    private final PropertyService propertyService;

    public AdminController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    @GetMapping("/properties")
    @Operation(summary = "Get all properties (ADMIN only)")
    public ResponseEntity<List<PropertyResponse>> getAllProperties() {
        logger.info("Admin fetching all properties");
        try {
            List<PropertyResponse> properties = propertyService.getAllProperties();
            logger.info("Admin fetched {} properties", properties.size());
            return ResponseEntity.ok(properties);
        } catch (Exception ex) {
            logger.error("Error fetching properties for admin", ex);
            return ResponseEntity.status(500).build();
        }
    }

    @PatchMapping("/properties/{id}/verify")
    @Operation(summary = "Verify or unverify a property (ADMIN only)")
    public ResponseEntity<?> verifyProperty(@PathVariable Long id, @RequestBody Map<String, Boolean> body) {
        boolean verified = body.getOrDefault("verified", true);
        propertyService.setVerified(id, verified);
        return ResponseEntity.ok().build();
    }
}
