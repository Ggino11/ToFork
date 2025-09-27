package com.tofork.restaurant.repository;

import com.tofork.restaurant.model.RestaurantModel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RestaurantRepository extends JpaRepository<RestaurantModel, Long> {
    List<RestaurantModel> findByNameContainingIgnoreCase(String name);
}
