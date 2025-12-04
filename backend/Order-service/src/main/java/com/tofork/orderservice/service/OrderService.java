package com.tofork.orderservice.service;

import com.tofork.orderservice.dto.CreateOrderRequest;
import com.tofork.orderservice.dto.UpdateOrderStatusRequest;
import com.tofork.orderservice.model.Order;
import com.tofork.orderservice.model.OrderStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface OrderService {

    /**
     * Crea un nuovo ordine
     */
    Order createOrder(CreateOrderRequest request) throws Exception;

    /**
     * Trova ordine per ID
     */
    Order findOrderById(Long orderId) throws Exception;

    /**
     * Aggiorna stato ordine
     */
    Order updateOrderStatus(Long orderId, UpdateOrderStatusRequest request, String userRole) throws Exception;

    /**
     * Cancella ordine (solo se in stato PENDING o CONFIRMED)
     */
    void cancelOrder(Long orderId, Long userId) throws Exception;

    /**
     * Ottieni tutti gli ordini di un utente
     */
    List<Order> getUserOrders(Long userId);

    /**
     * Ottieni ordini di un utente filtrati per stato
     */
    List<Order> getUserOrdersByStatus(Long userId, OrderStatus status);

    /**
     * Ottieni tutti gli ordini di un ristorante
     */
    List<Order> getRestaurantOrders(Long restaurantId);

    /**
     * Ottieni ordini di un ristorante filtrati per stato
     */
    List<Order> getRestaurantOrdersByStatus(Long restaurantId, OrderStatus status);

    /**
     * Ottieni ordini di un ristorante per range di date
     */
    List<Order> getRestaurantOrdersByDateRange(Long restaurantId, LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Verifica se l'utente può accedere all'ordine
     */
    boolean canUserAccessOrder(Long orderId, Long userId, String userRole) throws Exception;

    /**
     * Verifica se il ristorante può accedere all'ordine
     */
    boolean canRestaurantAccessOrder(Long orderId, Long restaurantId) throws Exception;
}
