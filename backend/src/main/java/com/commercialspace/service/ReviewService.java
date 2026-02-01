package com.commercialspace.service;

import com.commercialspace.dto.ReviewRequest;
import com.commercialspace.dto.ReviewResponse;
import com.commercialspace.model.Property;
import com.commercialspace.model.Review;
import com.commercialspace.model.User;
import com.commercialspace.repository.PropertyRepository;
import com.commercialspace.repository.ReviewRepository;
import com.commercialspace.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {
    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private PropertyRepository propertyRepository;
    @Autowired
    private UserRepository userRepository;

    public List<ReviewResponse> getReviewsForProperty(Long propertyId) {
        return reviewRepository.findByPropertyId(propertyId).stream().map(this::toDto).collect(Collectors.toList());
    }

    public ReviewResponse addReview(Long propertyId, String userEmail, ReviewRequest request) {
        Property property = propertyRepository.findById(propertyId).orElseThrow();
        User user = userRepository.findByEmail(userEmail).orElseThrow();
        Review review = new Review();
        review.setProperty(property);
        review.setUser(user);
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        Review saved = reviewRepository.save(review);
        return toDto(saved);
    }

    private ReviewResponse toDto(Review review) {
        ReviewResponse dto = new ReviewResponse();
        dto.setId(review.getId());
        dto.setReviewerName(review.getUser().getName());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setCreatedAt(review.getCreatedAt());
        return dto;
    }
} 