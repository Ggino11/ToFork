package com.tofork.order.repository;

import com.tofork.order.model.OrderModel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<OrderModel, Long> {
    List<OrderModel> findByUserId(Long userId);
}
