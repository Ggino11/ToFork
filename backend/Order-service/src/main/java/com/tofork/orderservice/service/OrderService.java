package com.tofork.order.service;

import com.tofork.order.model.OrderModel;
import com.tofork.order.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class OrderService {
    @Autowired
    private OrderRepository repository;

    public OrderModel createOrder(OrderModel order) {
        return repository.save(order);
    }

    public List<OrderModel> getOrdersByUser(Long userId) {
        return repository.findByUserId(userId);
    }
}
