package com.tofork.userservice.controller;

import com.tofork.userservice.dto.ApiResponse;
import com.tofork.userservice.dto.LoginRequest;
import com.tofork.userservice.dto.RegisterRequest;
import com.tofork.userservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * AuthController - Endpoint per autenticazione ToFork
 */
@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserService userService;

    /**
     * POST /auth/register - Registrazione unificata
     */
    @PostMapping("/auth/register")
    public ResponseEntity<ApiResponse<Map<String, Object>>> register(@RequestBody RegisterRequest request) {
        ApiResponse<Map<String, Object>> response = userService.register(request);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/auth/register-restaurant - Endpoint alternativo per ristoratori
     * (compatibilità con frontend che usa /api/auth/register-restaurant)
     */
    @PostMapping("/api/auth/register-restaurant")
    public ResponseEntity<ApiResponse<Map<String, Object>>> registerRestaurant(@RequestBody RegisterRequest request) {
        // Forza il tipo a restaurant
        request.setUserType("restaurant");
        ApiResponse<Map<String, Object>> response = userService.register(request);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /auth/login - Login utente
     */
    @PostMapping("/auth/login")
    public ResponseEntity<ApiResponse<Map<String, Object>>> login(@RequestBody LoginRequest request) {
        ApiResponse<Map<String, Object>> response = userService.login(request);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /auth/validate - Validazione token
     * Restituisce formato { valid: boolean, user: object } per compatibilità frontend
     */
    @GetMapping("/auth/validate")
    public ResponseEntity<Map<String, Object>> validateToken(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.ok(Map.of("valid", false, "user", null));
        }

        String token = authHeader.substring(7);
        Map<String, Object> response = userService.validateToken(token);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /auth/logout - Logout (gestito lato client)
     */
    @PostMapping("/auth/logout")
    public ResponseEntity<ApiResponse<Object>> logout() {
        return ResponseEntity.ok(ApiResponse.success("Logout effettuato", null));
    }
}
