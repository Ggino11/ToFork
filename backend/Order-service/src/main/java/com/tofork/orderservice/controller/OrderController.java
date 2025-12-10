package com.tofork.orderservice.controller;

import com.tofork.orderservice.dto.ApiResponse;
import com.tofork.orderservice.dto.CreateOrderRequest;
import com.tofork.orderservice.jwt.JwtService;
import com.tofork.orderservice.model.Order;
import com.tofork.orderservice.model.OrderStatus;
import com.tofork.orderservice.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;


import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private JwtService jwtService;

    // Helper for Auth
    private Long getUserId(String authHeader) throws Exception {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) throw new Exception("Token non valido");
        String token = authHeader.substring(7);
        if (!jwtService.validateToken(token)) throw new Exception("Token scaduto");
        return jwtService.getUserIdFromToken(token);
    }
    
    private void verifyRole(String authHeader, String requiredRole) throws Exception {
         String token = authHeader.substring(7);
         String role = jwtService.getRoleFromToken(token);
         if (!requiredRole.equals(role)) throw new Exception("Accesso negato");
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Order>> createOrder(
            @RequestBody CreateOrderRequest request,
            @RequestHeader("Authorization") String authHeader) {
        try {
            Long userId = getUserId(authHeader);
            // Validation: Only override if essential, otherwise trust token
            if (request.getUserId() != null && !request.getUserId().equals(userId)) {
                 return ResponseEntity.ok(ApiResponse.error("User ID check failed"));
            }
            // Logic
            Order order = orderService.createOrder(request, userId, authHeader);
            return ResponseEntity.ok(ApiResponse.success("Ordine creato con successo", order));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error("Errore creazione ordine: " + e.getMessage()));
        }
    }

    @GetMapping("/user/me")
    public ResponseEntity<ApiResponse<List<Order>>> getMyOrders(
            @RequestHeader("Authorization") String authHeader) {
        try {
            Long userId = getUserId(authHeader);
            return ResponseEntity.ok(ApiResponse.success("Success", orderService.getUserOrders(userId)));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/restaurant/me")
    public ResponseEntity<ApiResponse<List<Order>>> getRestaurantOrders(
            @RequestParam(required = false) String status,
            @RequestHeader("Authorization") String authHeader) {
        try {
            Long userId = getUserId(authHeader);
            verifyRole(authHeader, "RESTAURANT_OWNER");

            Long restaurantId = fetchRestaurantIdByOwner(userId, authHeader);
            
            List<Order> list;
            if (status != null && !status.isEmpty()) {
                list = orderService.getRestaurantOrdersByStatus(restaurantId, OrderStatus.valueOf(status.toUpperCase()));
            } else {
                list = orderService.getRestaurantOrders(restaurantId);
            }
            return ResponseEntity.ok(ApiResponse.success("Success", list));
            
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        }
    }
    
    // Helper to fetch restaurant ID
    private Long fetchRestaurantIdByOwner(Long ownerId, String authHeader) throws Exception {
        // Mocking logic or real call - let's try real call
        // http://tofork-restaurant-service:8083/api/restaurants/owner/{id}
        // http://tofork-restaurant-service:8083/api/restaurants/owner/{id}
         RestTemplate rt = new RestTemplate();
         HttpHeaders headers = new HttpHeaders();
         headers.set("Authorization", authHeader);
         HttpEntity<String> entity = new HttpEntity<>(headers);
         
         // Response is List<Restaurant>
         ResponseEntity<List> response = rt.exchange(
             "http://tofork-restaurant-service:8083/api/restaurants/owner/" + ownerId,
             HttpMethod.GET,
             entity,
             List.class
         );
         
         List<Map<String, Object>> restaurants = response.getBody();
         if (restaurants != null && !restaurants.isEmpty()) {
             Number n = (Number) restaurants.get(0).get("id");
             return n.longValue();
         }
         throw new Exception("Nessun ristorante trovato per questo utente");
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Order>> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @RequestHeader("Authorization") String authHeader) {
        try {
            Long userId = getUserId(authHeader);
            verifyRole(authHeader, "RESTAURANT_OWNER");
            
            String status = body.get("status");
            if (status == null) return ResponseEntity.ok(ApiResponse.error("Status mancante"));
            
            Order order = orderService.updateOrderStatus(id, OrderStatus.valueOf(status.toUpperCase()), userId);
            return ResponseEntity.ok(ApiResponse.success("Stato aggiornato", order));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/{id}/pay")
    public ResponseEntity<ApiResponse<Order>> payOrder(
        @PathVariable Long id,
        @RequestHeader("Authorization") String authHeader) {
        try {
            getUserId(authHeader); // just validate token
            // Mock payment
            String paymentId = "PAY-" + System.currentTimeMillis();
            Order order = orderService.markOrderPaid(id, paymentId);
            return ResponseEntity.ok(ApiResponse.success("Pagamento effettuato", order));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        }
    }
}
