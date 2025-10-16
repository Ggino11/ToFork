package com.tofork.paymentservice.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/")
    public String home() {
        return "💳 Payment-Service is running! Port: 8084";
    }

    @GetMapping("/test")
    public String test() {
        return "✅ Payment-Service Test Endpoint Working!";
    }

    @GetMapping("/api/payments/test")
    public String testPayments() {
        return "💰 Payments API is available! Stripe integration ready.";
    }
}

// da eliminare