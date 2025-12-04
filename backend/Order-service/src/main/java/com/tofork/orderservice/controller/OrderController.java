package com.tofork.orderservice.controller;

import com.tofork.orderservice.dto.ApiResponse;
import com.tofork.orderservice.dto.CreateOrderRequest;
import com.tofork.orderservice.dto.UpdateOrderStatusRequest;
import com.tofork.orderservice.jwt.JwtService;
import com.tofork.orderservice.model.Order;
import com.tofork.orderservice.model.OrderStatus;
import com.tofork.orderservice.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

/**
 * OrderController - Endpoint per gestione ordini ToFork
 */
@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private JwtService jwtService;

    /**
     * POST /api/orders - Crea nuovo ordine
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Order>> createOrder(
            @RequestBody CreateOrderRequest request,
            @RequestHeader("Authorization") String authHeader) {
        try {
            // Validazione token
            if (!isValidAuthHeader(authHeader)) {
                return ResponseEntity.ok(ApiResponse.error("Token non valido"));
            }

            String token = extractToken(authHeader);
            if (!jwtService.validateToken(token)) {
                return ResponseEntity.ok(ApiResponse.error("Token scaduto o non valido"));
            }

            // Estrai info utente dal token
            Long tokenUserId = jwtService.getUserIdFromToken(token);
            String userEmail = jwtService.getEmailFromToken(token);
            String userName = jwtService.getFullNameFromToken(token);

            // Verifica corrispondenza con i dati della richiesta
            if (!tokenUserId.equals(request.getUserId())) {
                return ResponseEntity.ok(ApiResponse.error("ID utente non corrispondente"));
            }

            // Imposta dati utente dal token (più sicuri)
            request.setUserEmail(userEmail);
            request.setUserName(userName);

            Order createdOrder = orderService.createOrder(request);
            return ResponseEntity.ok(ApiResponse.success("Ordine creato con successo", createdOrder));

        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error("Errore durante creazione ordine: " + e.getMessage()));
        }
    }

    /**
     * GET /api/orders/{orderId} - Dettagli ordine specifico
     */
    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<Order>> getOrderById(
            @PathVariable Long orderId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            if (!isValidAuthHeader(authHeader)) {
                return ResponseEntity.ok(ApiResponse.error("Token non valido"));
            }

            String token = extractToken(authHeader);
            if (!jwtService.validateToken(token)) {
                return ResponseEntity.ok(ApiResponse.error("Token scaduto o non valido"));
            }

            Long userId = jwtService.getUserIdFromToken(token);
            String userRole = jwtService.getRoleFromToken(token);

            // Verifica autorizzazione
            if (!orderService.canUserAccessOrder(orderId, userId, userRole)) {
                return ResponseEntity.ok(ApiResponse.error("Non autorizzato ad accedere a questo ordine"));
            }

            Order order = orderService.findOrderById(orderId);
            return ResponseEntity.ok(ApiResponse.success("Ordine trovato", order));

        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error("Errore durante recupero ordine: " + e.getMessage()));
        }
    }

    /**
     * GET /api/orders/user/{userId} - Storico ordini utente
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<Order>>> getUserOrders(
            @PathVariable Long userId,
            @RequestParam(required = false) String status,
            @RequestHeader("Authorization") String authHeader) {
        try {
            if (!isValidAuthHeader(authHeader)) {
                return ResponseEntity.ok(ApiResponse.error("Token non valido"));
            }

            String token = extractToken(authHeader);
            if (!jwtService.validateToken(token)) {
                return ResponseEntity.ok(ApiResponse.error("Token scaduto o non valido"));
            }

            Long tokenUserId = jwtService.getUserIdFromToken(token);
            String userRole = jwtService.getRoleFromToken(token);

            // Verifica autorizzazione (utente può vedere solo i propri ordini, admin può vedere tutti)
            if (!tokenUserId.equals(userId) && !"ADMIN".equals(userRole)) {
                return ResponseEntity.ok(ApiResponse.error("Non autorizzato a vedere gli ordini di questo utente"));
            }

            List<Order> orders;
            if (status != null && !status.trim().isEmpty()) {
                OrderStatus orderStatus = OrderStatus.valueOf(status.toUpperCase());
                orders = orderService.getUserOrdersByStatus(userId, orderStatus);
            } else {
                orders = orderService.getUserOrders(userId);
            }

            return ResponseEntity.ok(ApiResponse.success("Ordini utente recuperati", orders));

        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error("Errore durante recupero ordini utente: " + e.getMessage()));
        }
    }

    /**
     * GET /api/orders/restaurant/{restaurantId} - Ordini del ristorante
     */
    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<ApiResponse<List<Order>>> getRestaurantOrders(
            @PathVariable Long restaurantId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestHeader("Authorization") String authHeader) {
        try {
            if (!isValidAuthHeader(authHeader)) {
                return ResponseEntity.ok(ApiResponse.error("Token non valido"));
            }

            String token = extractToken(authHeader);
            if (!jwtService.validateToken(token)) {
                return ResponseEntity.ok(ApiResponse.error("Token scaduto o non valido"));
            }

            String userRole = jwtService.getRoleFromToken(token);

            // Solo ristoratori e admin possono vedere ordini di ristoranti
            if (!"RESTAURANT_OWNER".equals(userRole) && !"ADMIN".equals(userRole)) {
                return ResponseEntity.ok(ApiResponse.error("Non autorizzato a vedere ordini del ristorante"));
            }

            List<Order> orders;

            // Filtra per date se specificate
            if (startDate != null && endDate != null) {
                DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
                LocalDateTime start = LocalDateTime.parse(startDate, formatter);
                LocalDateTime end = LocalDateTime.parse(endDate, formatter);
                orders = orderService.getRestaurantOrdersByDateRange(restaurantId, start, end);
            }
            // Filtra per stato se specificato
            else if (status != null && !status.trim().isEmpty()) {
                OrderStatus orderStatus = OrderStatus.valueOf(status.toUpperCase());
                orders = orderService.getRestaurantOrdersByStatus(restaurantId, orderStatus);
            }
            // Tutti gli ordini del ristorante
            else {
                orders = orderService.getRestaurantOrders(restaurantId);
            }

            return ResponseEntity.ok(ApiResponse.success("Ordini ristorante recuperati", orders));

        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error("Errore durante recupero ordini ristorante: " + e.getMessage()));
        }
    }

    /**
     * PUT /api/orders/{orderId}/status - Aggiorna stato ordine
     */
    @PutMapping("/{orderId}/status")
    public ResponseEntity<ApiResponse<Order>> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestBody UpdateOrderStatusRequest request,
            @RequestHeader("Authorization") String authHeader) {
        try {
            if (!isValidAuthHeader(authHeader)) {
                return ResponseEntity.ok(ApiResponse.error("Token non valido"));
            }

            String token = extractToken(authHeader);
            if (!jwtService.validateToken(token)) {
                return ResponseEntity.ok(ApiResponse.error("Token scaduto o non valido"));
            }

            String userRole = jwtService.getRoleFromToken(token);

            // Solo ristoratori e admin possono aggiornare stato ordini
            if (!"RESTAURANT_OWNER".equals(userRole) && !"ADMIN".equals(userRole)) {
                return ResponseEntity.ok(ApiResponse.error("Non autorizzato ad aggiornare stato ordine"));
            }

            Order updatedOrder = orderService.updateOrderStatus(orderId, request, userRole);
            return ResponseEntity.ok(ApiResponse.success("Stato ordine aggiornato", updatedOrder));

        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error("Errore durante aggiornamento stato: " + e.getMessage()));
        }
    }

    /**
     * PUT /api/orders/{orderId}/cancel - Cancella ordine
     */
    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<ApiResponse<Object>> cancelOrder(
            @PathVariable Long orderId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            if (!isValidAuthHeader(authHeader)) {
                return ResponseEntity.ok(ApiResponse.error("Token non valido"));
            }

            String token = extractToken(authHeader);
            if (!jwtService.validateToken(token)) {
                return ResponseEntity.ok(ApiResponse.error("Token scaduto o non valido"));
            }

            Long userId = jwtService.getUserIdFromToken(token);

            orderService.cancelOrder(orderId, userId);
            return ResponseEntity.ok(ApiResponse.success("Ordine cancellato con successo", null));

        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error("Errore durante cancellazione ordine: " + e.getMessage()));
        }
    }

    // Helper methods
    private boolean isValidAuthHeader(String authHeader) {
        return authHeader != null && authHeader.startsWith("Bearer ");
    }

    private String extractToken(String authHeader) {
        return authHeader.substring(7);
    }
}
