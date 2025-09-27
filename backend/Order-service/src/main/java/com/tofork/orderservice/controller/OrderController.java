package com.tofork.order.controller;

import com.tofork.order.model.OrderModel;
import com.tofork.order.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    @Autowired
    private OrderService service;

    @PreAuthorize("isAuthenticated()")
    @PostMapping
    public OrderModel createOrder(@RequestBody OrderModel order) {
        return service.createOrder(order);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/byUser/{userId}")
    public List<OrderModel> getUserOrders(@PathVariable Long userId) {
        return service.getOrdersByUser(userId);
    }
}
