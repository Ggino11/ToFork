package com.tofork.restaurantservice.repository;

import com.tofork.restaurantservice.model.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MenuItemRepository extends JpaRepository<MenuItem,Long> {
    List<MenuItem> findbyRestaurantId(Long restaurantId);
    List<MenuItem> findbyName(String name);
}
