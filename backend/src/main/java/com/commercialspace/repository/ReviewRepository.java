package com.commercialspace.repository;

import com.commercialspace.model.Review;
import com.commercialspace.model.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByPropertyId(Long propertyId);
    long countByPropertyId(Long propertyId);
    Double findAverageRatingByPropertyId(Long propertyId);
} 