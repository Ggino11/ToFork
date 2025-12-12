package com.tofork.orderservice.service;

import com.tofork.orderservice.dto.CreateOrderRequest;
import com.tofork.orderservice.model.Order;
import com.tofork.orderservice.model.OrderStatus;

import java.util.List;

public interface OrderService {
    Order createOrder(CreateOrderRequest request, Long userId, String authToken) throws Exception;

    // NUOVO METODO AGGIUNTO
    Order updateOrder(Long orderId, CreateOrderRequest request, Long userId) throws Exception;

    List<Order> getUserOrders(Long userId);

    List<Order> getRestaurantOrders(Long restaurantId);

    List<Order> getRestaurantOrdersByStatus(Long restaurantId, OrderStatus status);

    Order updateOrderStatus(Long orderId, OrderStatus newStatus, Long ownerId) throws Exception;

    Order markOrderPaid(Long orderId, String paymentId) throws Exception;

    void deleteOrder(Long orderId, Long userId) throws Exception;
}