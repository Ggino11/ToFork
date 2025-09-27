package com.tofork.booking.controller;

import com.tofork.booking.model.BookingModel;
import com.tofork.booking.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    @Autowired
    private BookingService service;

    @PreAuthorize("isAuthenticated()")
    @PostMapping
    public BookingModel book(@RequestBody BookingModel booking) {
        return service.book(booking);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/byUser/{userId}")
    public List<BookingModel> getUserBookings(@PathVariable Long userId) {
        return service.getByUser(userId);
    }
}
