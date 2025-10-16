package com.tofork.bookingservice.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/")
    public String home() {
        return "🎉 Booking-Service is running! Port: 8083";
    }

    @GetMapping("/test")
    public String test() {
        return "✅ Booking-Service Test Endpoint Working!";
    }
}


//<-file da eliminare->