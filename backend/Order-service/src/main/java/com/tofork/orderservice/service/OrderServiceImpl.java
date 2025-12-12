package com.tofork.orderservice.service;

import com.tofork.orderservice.dto.CreateOrderRequest;
import com.tofork.orderservice.dto.OrderItemDTO;
import com.tofork.orderservice.model.Order;
import com.tofork.orderservice.model.OrderItem;
import com.tofork.orderservice.model.OrderStatus;
import com.tofork.orderservice.model.OrderType;
import com.tofork.orderservice.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    private final RestTemplate restTemplate = new RestTemplate();

    // Internal service URL (docker network)
    private final String BOOKING_SERVICE_URL = "http://tofork-booking-service:8085/api/bookings";

    @Override
    @Transactional
    public Order createOrder(CreateOrderRequest request, Long userId, String authToken) throws Exception {
        // 1. Determine Order Type
        OrderType type = OrderType.TAKEAWAY;
        if (request.getOrderType() != null) {
            try {
                type = OrderType.valueOf(request.getOrderType());
            } catch (IllegalArgumentException e) {
                throw new Exception("Tipo ordine non valido: " + request.getOrderType());
            }
        }

        // 2. Validate DINE_IN
        if (type == OrderType.DINE_IN) {
            if (request.getBookingId() == null) throw new Exception("Prenotazione obbligatoria per ordine al tavolo");
            verifyBooking(request.getBookingId(), userId, request.getRestaurantId(), authToken);
        }

        // 3. Create Order Entity
        Order order = new Order();
        order.setUserId(userId);
        order.setRestaurantId(request.getRestaurantId());
        order.setBookingId(type == OrderType.DINE_IN ? request.getBookingId() : null); // Only set if DINE_IN
        order.setStatus(OrderStatus.PENDING);
        order.setTotalAmount(request.getTotalAmount());
        order.setOrderType(type);

        // 4. Add Items
        if (request.getItems() != null) {
            for (OrderItemDTO itemDTO : request.getItems()) {
                OrderItem item = new OrderItem();
                item.setMenuItemId(itemDTO.getFoodItemId());
                item.setName(itemDTO.getFoodItemName());
                item.setQuantity(itemDTO.getQuantity());
                item.setUnitPrice(itemDTO.getUnitPrice());
                item.setSpecialRequests(itemDTO.getSpecialRequests());
                item.setSubtotal(itemDTO.getUnitPrice() * itemDTO.getQuantity());
                order.addItem(item);
            }
        }

        return orderRepository.save(order);
    }

    @Override
    @Transactional
    public Order updateOrder(Long orderId, CreateOrderRequest request, Long userId) throws Exception {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new Exception("Ordine non trovato"));

        // Verifica che l'ordine appartenga all'utente
        if (!order.getUserId().equals(userId)) {
            throw new Exception("Non autorizzato a modificare questo ordine");
        }

        // Verifica che l'ordine sia modificabile (PENDING e non pagato)
        if (order.getStatus() != OrderStatus.PENDING || order.isPaid()) {
            throw new Exception("Non puoi modificare un ordine già pagato o in lavorazione");
        }

        // Aggiorna totale
        order.setTotalAmount(request.getTotalAmount());

        // Aggiorna tipo ordine se necessario
        if (request.getOrderType() != null) {
            try {
                order.setOrderType(OrderType.valueOf(request.getOrderType()));
            } catch (Exception e) { /* ignore */ }
        }

        // SVUOTA la lista attuale di piatti
        // Grazie a orphanRemoval=true in Order.java, questi verranno cancellati dal DB
        order.getItems().clear();

        // Aggiungi i nuovi piatti dalla richiesta
        if (request.getItems() != null) {
            for (OrderItemDTO itemDTO : request.getItems()) {
                OrderItem item = new OrderItem();
                item.setMenuItemId(itemDTO.getFoodItemId());
                item.setName(itemDTO.getFoodItemName());
                item.setQuantity(itemDTO.getQuantity());
                item.setUnitPrice(itemDTO.getUnitPrice());
                item.setSpecialRequests(itemDTO.getSpecialRequests());
                item.setSubtotal(itemDTO.getUnitPrice() * itemDTO.getQuantity());

                // Usa il metodo helper per impostare la relazione bidirezionale
                order.addItem(item);
            }
        }

        return orderRepository.save(order);
    }

    @Override
    @Transactional
    public void deleteOrder(Long orderId, Long userId) throws Exception {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new Exception("Ordine non trovato"));

        if (!order.getUserId().equals(userId)) {
            throw new Exception("Non autorizzato ad eliminare questo ordine");
        }

        // Possiamo eliminare solo se è PENDING e NON PAGATO
        if (order.getStatus() != OrderStatus.PENDING || order.isPaid()) {
            throw new Exception("Non puoi eliminare un ordine già in lavorazione o pagato");
        }

        orderRepository.delete(order);
    }

    private void verifyBooking(Long bookingId, Long userId, Long restaurantId, String authToken) throws Exception {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", authToken.startsWith("Bearer ") ? authToken : "Bearer " + authToken);

            ResponseEntity<Map> response = restTemplate.exchange(
                BOOKING_SERVICE_URL + "/" + bookingId,
                HttpMethod.GET,
                new HttpEntity<>(headers),
                Map.class
            );

            Map body = response.getBody();
            if (body == null || !Boolean.TRUE.equals(body.get("success"))) {
                throw new Exception("Prenotazione non trovata");
            }

            Map data = (Map) body.get("data");

            // Validate Ownership, Restaurant and Status
            Long bUserId = ((Number) data.get("userId")).longValue();
            Long bRestId = ((Number) data.get("restaurantId")).longValue();
            String status = (String) data.get("status");

            if (!bUserId.equals(userId)) throw new Exception("Prenotazione non tua");
            if (!bRestId.equals(restaurantId)) throw new Exception("Ristorante errato");
            if (!"CONFIRMED".equals(status)) throw new Exception("Prenotazione non CONFERMATA");

        } catch (Exception e) {
            throw new Exception("Check prenotazione fallito: " + e.getMessage());
        }
    }

    @Override
    public List<Order> getUserOrders(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Override
    public List<Order> getRestaurantOrders(Long restaurantId) {
        return orderRepository.findByRestaurantIdOrderByCreatedAtDesc(restaurantId);
    }

    @Override
    public List<Order> getRestaurantOrdersByStatus(Long restaurantId, OrderStatus status) {
        return orderRepository.findByRestaurantIdAndStatusOrderByCreatedAtAsc(restaurantId, status);
    }

    @Override
    @Transactional
    public Order updateOrderStatus(Long orderId, OrderStatus newStatus, Long ownerId) throws Exception {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new Exception("Ordine non trovato"));

        // Validation of transitions
        OrderStatus current = order.getStatus();

        // PENDING -> PREPARING
        if (current == OrderStatus.PENDING && newStatus == OrderStatus.PREPARING) {
            order.setStatus(newStatus);
        }
        // PREPARING -> COMPLETED
        else if (current == OrderStatus.PREPARING && newStatus == OrderStatus.COMPLETED) {
            order.setStatus(newStatus);
        }
        // Cancellazione lato ristoratore
        else if (newStatus == OrderStatus.CANCELLED) {
            order.setStatus(newStatus);
        }
        else {
            throw new Exception("Transizione di stato non valida: da " + current + " a " + newStatus);
        }

        return orderRepository.save(order);
    }

    @Override
    public Order markOrderPaid(Long orderId, String paymentId) throws Exception {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new Exception("Ordine non trovato"));

        order.setPaid(true);
        order.setPaymentId(paymentId);
        return orderRepository.save(order);
    }
}