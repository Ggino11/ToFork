package com.tofork.orderservice.repository;

import com.tofork.orderservice.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    // Find all items for a specific order
    List<OrderItem> findByOrderIdOrderByCreatedAtAsc(Long orderId);

    // Find items by food item ID across all orders
    List<OrderItem> findByFoodItemId(Long foodItemId);

    // Count total quantity sold for a specific food item
    @Query("SELECT SUM(oi.quantity) FROM OrderItem oi WHERE oi.foodItemId = :foodItemId")
    Long getTotalQuantitySoldByFoodItem(@Param("foodItemId") Long foodItemId);

    // Find most popular items for a restaurant (via order relationship)
    @Query("SELECT oi.foodItemName, oi.foodItemId, SUM(oi.quantity) as totalQuantity " +
            "FROM OrderItem oi JOIN oi.order o WHERE o.restaurantId = :restaurantId " +
            "GROUP BY oi.foodItemId, oi.foodItemName ORDER BY totalQuantity DESC")
    List<Object[]> findMostPopularItemsByRestaurant(@Param("restaurantId") Long restaurantId);

    // Calculate total revenue for a specific food item
    @Query("SELECT SUM(oi.totalPrice) FROM OrderItem oi WHERE oi.foodItemId = :foodItemId")
    Double getTotalRevenueByFoodItem(@Param("foodItemId") Long foodItemId);
}
