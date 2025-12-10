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
    List<OrderItem> findByOrderIdOrderByIdAsc(Long orderId);

    // Find items by food item ID across all orders
    List<OrderItem> findByMenuItemId(Long menuItemId);

    // Count total quantity sold for a specific food item
    @Query("SELECT SUM(oi.quantity) FROM OrderItem oi WHERE oi.menuItemId = :menuItemId")
    Long getTotalQuantitySoldByFoodItem(@Param("menuItemId") Long menuItemId);

    // Find most popular items for a restaurant (via order relationship)
    @Query("SELECT oi.name, oi.menuItemId, SUM(oi.quantity) as totalQuantity " +
            "FROM OrderItem oi JOIN oi.order o WHERE o.restaurantId = :restaurantId " +
            "GROUP BY oi.menuItemId, oi.name ORDER BY totalQuantity DESC")
    List<Object[]> findMostPopularItemsByRestaurant(@Param("restaurantId") Long restaurantId);

    // Calculate total revenue for a specific food item
    @Query("SELECT SUM(oi.subtotal) FROM OrderItem oi WHERE oi.menuItemId = :menuItemId")
    Double getTotalRevenueByFoodItem(@Param("menuItemId") Long menuItemId);
}
