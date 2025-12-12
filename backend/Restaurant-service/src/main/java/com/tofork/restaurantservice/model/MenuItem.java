package com.tofork.restaurantservice.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "menu_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenuItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonBackReference
    private Restaurant restaurant;

    @Column(nullable = false)
    private String name;

    // Aggiungiamo columnDefinition = "TEXT" anche qui per descrizioni lunghe
    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    // --- MODIFICA IMPORTANTE QUI ---
    // Usiamo TEXT per permettere stringhe Base64 molto lunghe
    @Column(columnDefinition = "TEXT")
    private String imageUrl;
    // -------------------------------

    private String category;

    @Column(nullable = false)
    private boolean available = true;
}