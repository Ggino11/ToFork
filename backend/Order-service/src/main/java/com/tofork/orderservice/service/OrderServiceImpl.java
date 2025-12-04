package com.tofork.orderservice.service;

import com.tofork.orderservice.dto.CreateOrderRequest;
import com.tofork.orderservice.dto.OrderItemRequest;
import com.tofork.orderservice.dto.UpdateOrderStatusRequest;
import com.tofork.orderservice.model.Order;
import com.tofork.orderservice.model.OrderItem;
import com.tofork.orderservice.model.OrderStatus;
import com.tofork.orderservice.repository.OrderRepository;
import com.tofork.orderservice.repository.OrderItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Override
    @Transactional
    public Order createOrder(CreateOrderRequest request) throws Exception {
        // Validazione input
        if (!request.isValid()) {
            throw new Exception("Dati ordine non validi");
        }

        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new Exception("L'ordine deve contenere almeno un prodotto");
        }

        // Crea ordine
        Order order = new Order();
        order.setUserId(request.getUserId());
        order.setUserEmail(request.getUserEmail());
        order.setUserName(request.getUserName());
        order.setRestaurantId(request.getRestaurantId());
        order.setRestaurantName(request.getRestaurantName());
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setPhoneNumber(request.getPhoneNumber());
        order.setSpecialInstructions(request.getSpecialInstructions());
        order.setDeliveryFee(request.getDeliveryFee());
        order.setTaxAmount(request.getTaxAmount());

        // Calcola totale dagli items
        BigDecimal itemsTotal = request.calculateItemsTotal();
        order.setTotalAmount(itemsTotal);

        // Imposta tempo di consegna stimato (60 minuti default)
        order.setEstimatedDeliveryTime(LocalDateTime.now().plusMinutes(60));

        // Salva ordine
        Order savedOrder = orderRepository.save(order);

        // Crea items
        for (OrderItemRequest itemRequest : request.getItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setFoodItemId(itemRequest.getFoodItemId());
            orderItem.setFoodItemName(itemRequest.getFoodItemName());
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setUnitPrice(itemRequest.getUnitPrice());
            orderItem.setSpecialRequests(itemRequest.getSpecialRequests());

            // Il totalPrice viene calcolato automaticamente in @PrePersist
            orderItemRepository.save(orderItem);
            savedOrder.addItem(orderItem);
        }

        return savedOrder;
    }

    @Override
    public Order findOrderById(Long orderId) throws Exception {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isEmpty()) {
            throw new Exception("Ordine non trovato con ID: " + orderId);
        }
        return orderOpt.get();
    }

    @Override
    @Transactional
    public Order updateOrderStatus(Long orderId, UpdateOrderStatusRequest request, String userRole) throws Exception {
        if (!request.isValid()) {
            throw new Exception("Richiesta aggiornamento stato non valida");
        }

        Order order = findOrderById(orderId);

        // Verifica autorizzazioni per aggiornamento stato
        if (request.getOrderStatus() != null) {
            validateOrderStatusUpdate(order, request.getOrderStatus(), userRole);
            order.setOrderStatus(request.getOrderStatus());

            // Aggiorna tempo di consegna effettivo se consegnato
            if (request.getOrderStatus() == OrderStatus.DELIVERED && order.getActualDeliveryTime() == null) {
                order.setActualDeliveryTime(LocalDateTime.now());
            }
        }

        if (request.getPaymentStatus() != null) {
            order.setPaymentStatus(request.getPaymentStatus());
        }

        return orderRepository.save(order);
    }

    private void validateOrderStatusUpdate(Order order, OrderStatus newStatus, String userRole) throws Exception {
        OrderStatus currentStatus = order.getOrderStatus();

        // Admin può fare qualsiasi cambio
        if ("ADMIN".equals(userRole)) {
            return;
        }

        // Restaurant owner può aggiornare solo certi stati
        if ("RESTAURANT_OWNER".equals(userRole)) {
            switch (newStatus) {
                case CONFIRMED:
                    if (currentStatus != OrderStatus.PENDING) {
                        throw new Exception("Può confermare solo ordini in attesa");
                    }
                    break;
                case PREPARING:
                    if (currentStatus != OrderStatus.CONFIRMED) {
                        throw new Exception("Può preparare solo ordini confermati");
                    }
                    break;
                case READY:
                    if (currentStatus != OrderStatus.PREPARING) {
                        throw new Exception("Può segnare pronto solo ordini in preparazione");
                    }
                    break;
                case OUT_FOR_DELIVERY:
                    if (currentStatus != OrderStatus.READY) {
                        throw new Exception("Può mandare in consegna solo ordini pronti");
                    }
                    break;
                case DELIVERED:
                    if (currentStatus != OrderStatus.OUT_FOR_DELIVERY) {
                        throw new Exception("Può segnare consegnato solo ordini in consegna");
                    }
                    break;
                case REJECTED:
                    if (currentStatus != OrderStatus.PENDING) {
                        throw new Exception("Può rifiutare solo ordini in attesa");
                    }
                    break;
                default:
                    throw new Exception("Stato non permesso per ristoratori");
            }
        } else {
            throw new Exception("Non autorizzato ad aggiornare stato ordine");
        }
    }

    @Override
    @Transactional
    public void cancelOrder(Long orderId, Long userId) throws Exception {
        Order order = findOrderById(orderId);

        // Verifica che l'ordine appartenga all'utente
        if (!order.getUserId().equals(userId)) {
            throw new Exception("Non autorizzato a cancellare questo ordine");
        }

        // Verifica che l'ordine possa essere cancellato
        if (!order.canBeCancelled()) {
            throw new Exception("Ordine non può essere cancellato nello stato attuale: " + order.getOrderStatus());
        }

        order.setOrderStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
    }

    @Override
    public List<Order> getUserOrders(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Override
    public List<Order> getUserOrdersByStatus(Long userId, OrderStatus status) {
        return orderRepository.findByUserIdAndOrderStatusOrderByCreatedAtDesc(userId, status);
    }

    @Override
    public List<Order> getRestaurantOrders(Long restaurantId) {
        return orderRepository.findByRestaurantIdOrderByCreatedAtDesc(restaurantId);
    }

    @Override
    public List<Order> getRestaurantOrdersByStatus(Long restaurantId, OrderStatus status) {
        return orderRepository.findByRestaurantIdAndOrderStatusOrderByCreatedAtDesc(restaurantId, status);
    }

    @Override
    public List<Order> getRestaurantOrdersByDateRange(Long restaurantId, LocalDateTime startDate, LocalDateTime endDate) {
        return orderRepository.findByRestaurantIdAndCreatedAtBetweenOrderByCreatedAtDesc(restaurantId, startDate, endDate);
    }

    @Override
    public boolean canUserAccessOrder(Long orderId, Long userId, String userRole) throws Exception {
        if ("ADMIN".equals(userRole)) {
            return true;
        }

        Order order = findOrderById(orderId);
        return order.getUserId().equals(userId);
    }

    @Override
    public boolean canRestaurantAccessOrder(Long orderId, Long restaurantId) throws Exception {
        Order order = findOrderById(orderId);
        return order.getRestaurantId().equals(restaurantId);
    }
}
