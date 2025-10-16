package com.tofork.orderservice.repository;

import com.tofork.orderservice.model.Order;
import com.tofork.orderservice.model.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // Find orders by user ID
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);

    // Find orders by restaurant ID
    List<Order> findByRestaurantIdOrderByCreatedAtDesc(Long restaurantId);

    // Find orders by restaurant ID and status
    List<Order> findByRestaurantIdAndOrderStatusOrderByCreatedAtDesc(Long restaurantId, OrderStatus status);

    // Find orders by status
    List<Order> findByOrderStatusOrderByCreatedAtDesc(OrderStatus status);

    // Find orders by user ID and status
    List<Order> findByUserIdAndOrderStatusOrderByCreatedAtDesc(Long userId, OrderStatus status);

    // Find orders by date range
    List<Order> findByCreatedAtBetweenOrderByCreatedAtDesc(LocalDateTime startDate, LocalDateTime endDate);

    // Find orders by restaurant and date range
    List<Order> findByRestaurantIdAndCreatedAtBetweenOrderByCreatedAtDesc(
            Long restaurantId, LocalDateTime startDate, LocalDateTime endDate);

    // Count orders by status for a restaurant
    @Query("SELECT COUNT(o) FROM Order o WHERE o.restaurantId = :restaurantId AND o.orderStatus = :status")
    Long countByRestaurantIdAndStatus(@Param("restaurantId") Long restaurantId, @Param("status") OrderStatus status);

    // Count total orders for a restaurant
    Long countByRestaurantId(Long restaurantId);

    // Count orders for a user
    Long countByUserId(Long userId);

    // Find paginated orders
    Page<Order> findAllByOrderByCreatedAtDesc(Pageable pageable);

    // Find paginated orders by restaurant
    Page<Order> findByRestaurantIdOrderByCreatedAtDesc(Long restaurantId, Pageable pageable);

    // Find paginated orders by user
    Page<Order> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    // Check if order exists and belongs to user (for authorization)
    Optional<Order> findByIdAndUserId(Long orderId, Long userId);

    // Check if order exists and belongs to restaurant (for authorization)
    Optional<Order> findByIdAndRestaurantId(Long orderId, Long restaurantId);

    // Revenue calculations
    @Query("SELECT SUM(o.totalAmount + o.deliveryFee + o.taxAmount) FROM Order o WHERE o.restaurantId = :restaurantId AND o.paymentStatus = 'PAID'")
    Double calculateTotalRevenueByRestaurant(@Param("restaurantId") Long restaurantId);

    @Query("SELECT SUM(o.totalAmount + o.deliveryFee + o.taxAmount) FROM Order o WHERE o.restaurantId = :restaurantId AND o.paymentStatus = 'PAID' AND o.createdAt BETWEEN :startDate AND :endDate")
    Double calculateRevenueByRestaurantAndDateRange(@Param("restaurantId") Long restaurantId,
                                                    @Param("startDate") LocalDateTime startDate,
                                                    @Param("endDate") LocalDateTime endDate);
}
