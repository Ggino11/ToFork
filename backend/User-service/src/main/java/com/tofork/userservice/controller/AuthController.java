package com.tofork.userservice.controller;


import com.tofork.userservice.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@RequestBody RegisterRequest request) {
        ApiResponse<AuthResponse> response = userService.registerUser(request);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().body(response);
    }

    @PostMapping("/register-restaurant")
    public ResponseEntity<ApiResponse<AuthResponse>> registerRestaurant(@RequestBody RegisterRestaurantRequest request) {
        ApiResponse<AuthResponse> response = userService.registerRestaurant(request);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@RequestBody LoginRequest request) {
        ApiResponse<AuthResponse> response = userService.loginUser(request);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().body(response);
    }

    @GetMapping("/validate")
    public ResponseEntity<ApiResponse<UserResponse>> validate(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Token mancante"));
        }

        String token = authHeader.substring(7);
        ApiResponse<UserResponse> response = userService.validateToken(token);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().body(response);
    }
}
