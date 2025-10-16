package com.tofork.orderservice.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/")
    public String home() {
        return "🍕 Order-Service is running! Port: 8082";
    }

    @GetMapping("/test")
    public String test() {
        return "✅ Order-Service Test Endpoint Working!";
    }

    @GetMapping("/api/orders/test")
    public String testOrders() {
        return "📦 Orders API is available! Use POST with JWT token to create orders.";
    }
}