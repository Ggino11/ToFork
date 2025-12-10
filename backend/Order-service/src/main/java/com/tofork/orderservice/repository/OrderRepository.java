package com.tofork.orderservice.repository;

import com.tofork.orderservice.model.Order;
import com.tofork.orderservice.model.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    // Find User Orders
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);

    // Find Restaurant Orders
    List<Order> findByRestaurantIdOrderByCreatedAtDesc(Long restaurantId);
    
    // Find Restaurant Orders by Status
    List<Order> findByRestaurantIdAndStatusOrderByCreatedAtAsc(Long restaurantId, OrderStatus status);
}
