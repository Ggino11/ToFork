package com.tofork.restaurantservice.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "restaurants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Restaurant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String address;

    private String description;

    @Column(unique = true)
    private String slug;

    private String image;

    private String category;

    private Double averagePrice;

    private Double lat;
    private Double lon;

    @Builder.Default
    @ElementCollection
    private List<String> highlights = new ArrayList<>();

    /**
     * id dell'utente ristoratore nel User-service
     */
    @Column(name = "owner_id", nullable = false)
    private Long ownerId;

    @Builder.Default
    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL)
    @com.fasterxml.jackson.annotation.JsonManagedReference
    private List<RestaurantTable> tables = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL)
    @com.fasterxml.jackson.annotation.JsonManagedReference
    private List<MenuItem> menuItems = new ArrayList<>();
}
