package com.commercialspace.repository;

import com.commercialspace.model.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {
    List<Property> findByVerifiedTrue();
    List<Property> findByOwnerId(Long ownerId);
    List<Property> findByOwnerEmail(String ownerEmail);
    List<Property> findByVerifiedTrueAndTitleContainingIgnoreCaseOrVerifiedTrueAndAddressContainingIgnoreCaseOrVerifiedTrueAndStateContainingIgnoreCaseOrVerifiedTrueAndCityContainingIgnoreCaseOrVerifiedTrueAndCountryContainingIgnoreCase(String title, String address, String state, String city, String country);
}
