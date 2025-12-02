package com.tofork.restaurantservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantDTO {
    private Long id;
    private String name;
    private String slug;
    private String address;
    private String description;
    private String image;
    private String category;
    private Double averagePrice;
    private Double lat;
    private Double lon;
    private List<String> highlights;
    private Map<String, List<MenuItemDTO>> menu;
    private Long ownerId;
}
