package com.tofork.restaurant.model;

import jakarta.persistence.*;

@Entity
@Table(name = "restaurants")
public class RestaurantModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String location;
    private String imageUrl;
    private String description;

    public RestaurantModel() {}
    public RestaurantModel(String name, String location, String imageUrl, String description) {
        this.name = name;
        this.location = location;
        this.imageUrl = imageUrl;
        this.description = description;
    }
    // getter e setter
}
