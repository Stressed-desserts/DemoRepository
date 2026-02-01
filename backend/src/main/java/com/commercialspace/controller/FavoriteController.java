package com.commercialspace.controller;

import com.commercialspace.dto.FavoriteResponse;
import com.commercialspace.model.Favorite;
import com.commercialspace.service.FavoriteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {
    @Autowired
    private FavoriteService favoriteService;

    @GetMapping
    public ResponseEntity<List<FavoriteResponse>> getFavorites(@AuthenticationPrincipal Principal principal) {
        List<FavoriteResponse> favorites = favoriteService.getFavoritesByUser(principal.getName());
        return ResponseEntity.ok(favorites);
    }

    @GetMapping("/check/{propertyId}")
    public ResponseEntity<Boolean> isFavorited(@AuthenticationPrincipal Principal principal, @PathVariable Long propertyId) {
        boolean favorited = favoriteService.isFavorited(principal.getName(), propertyId);
        return ResponseEntity.ok(favorited);
    }

    @PostMapping("/{propertyId}")
    public ResponseEntity<FavoriteResponse> addFavorite(@AuthenticationPrincipal Principal principal, @PathVariable Long propertyId) {
        FavoriteResponse favorite = favoriteService.toDto(favoriteService.addFavorite(principal.getName(), propertyId));
        return ResponseEntity.ok(favorite);
    }

    @DeleteMapping("/{propertyId}")
    public ResponseEntity<Void> removeFavorite(@AuthenticationPrincipal Principal principal, @PathVariable Long propertyId) {
        favoriteService.removeFavorite(principal.getName(), propertyId);
        return ResponseEntity.ok().build();
    }
}