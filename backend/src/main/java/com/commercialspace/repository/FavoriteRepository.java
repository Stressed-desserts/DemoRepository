package com.commercialspace.repository;

import com.commercialspace.model.Favorite;
import com.commercialspace.model.User;
import com.commercialspace.model.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findByUser(User user);
    Optional<Favorite> findByUserAndProperty(User user, Property property);
    void deleteByUserAndProperty(User user, Property property);
}