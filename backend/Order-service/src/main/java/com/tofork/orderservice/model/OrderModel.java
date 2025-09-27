package com.tofork.order.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
public class OrderModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private Long restaurantId;
    private LocalDateTime orderDate;
    private String status; // es. "PENDING", "CONFIRMED"

    // altri campi tipo prezzo totale, lista piatti

    // getter e setter
}
