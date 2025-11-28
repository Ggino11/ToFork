package com.tofork.restaurantservice.repository;

import com.tofork.restaurantservice.model.RestaurantTable;
import com.tofork.restaurantservice.model.TableStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RestaurantTableRepository extends JpaRepository<RestaurantTable, Long> {
    List<RestaurantTable> findByRestaurantId(Long restaurantId);
    // per implementazioni future ma potenzialmente inutile
    List<RestaurantTable> findByRestaurantIdAndStatus(Long restaurantId, TableStatus status);
}
