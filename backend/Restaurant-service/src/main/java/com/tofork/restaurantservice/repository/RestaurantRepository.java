package com.tofork.restaurantservice.repository;

import com.tofork.restaurantservice.model.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    List<Restaurant> findByOwnerId(Long ownerId);

    List<Restaurant> findByName(String name);

    List<Restaurant> findbydescription(String description);
}
