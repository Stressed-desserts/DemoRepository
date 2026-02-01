package com.commercialspace.service;

import com.commercialspace.model.Favorite;
import com.commercialspace.model.User;
import com.commercialspace.model.Property;
import com.commercialspace.repository.FavoriteRepository;
import com.commercialspace.repository.UserRepository;
import com.commercialspace.repository.PropertyRepository;
import com.commercialspace.dto.FavoriteResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FavoriteService {
    @Autowired
    private FavoriteRepository favoriteRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PropertyRepository propertyRepository;

    public List<FavoriteResponse> getFavoritesByUser(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return favoriteRepository.findByUser(user).stream()
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    public boolean isFavorited(String userEmail, Long propertyId) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));
        Property property = propertyRepository.findById(propertyId)
            .orElseThrow(() -> new RuntimeException("Property not found"));
        return favoriteRepository.findByUserAndProperty(user, property).isPresent();
    }

    public Favorite addFavorite(String userEmail, Long propertyId) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));
        Property property = propertyRepository.findById(propertyId)
            .orElseThrow(() -> new RuntimeException("Property not found"));
        Optional<Favorite> existing = favoriteRepository.findByUserAndProperty(user, property);
        if (existing.isPresent()) return existing.get();
        Favorite favorite = new Favorite(user, property);
        return favoriteRepository.save(favorite);
    }

    public void removeFavorite(String userEmail, Long propertyId) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));
        Property property = propertyRepository.findById(propertyId)
            .orElseThrow(() -> new RuntimeException("Property not found"));
        favoriteRepository.deleteByUserAndProperty(user, property);
    }

    public FavoriteResponse toDto(Favorite favorite) {
        return new FavoriteResponse(
            favorite.getId(),
            favorite.getProperty().getId(),
            favorite.getProperty().getTitle(),
            favorite.getProperty().getAddress(),
            favorite.getCreatedAt()
        );
    }
} 