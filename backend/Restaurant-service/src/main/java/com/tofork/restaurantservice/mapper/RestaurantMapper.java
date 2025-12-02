package com.tofork.restaurantservice.mapper;

import com.tofork.restaurantservice.dto.MenuItemDTO;
import com.tofork.restaurantservice.dto.RestaurantDTO;
import com.tofork.restaurantservice.model.MenuItem;
import com.tofork.restaurantservice.model.Restaurant;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class RestaurantMapper {

    public RestaurantDTO toDTO(Restaurant restaurant) {
        if (restaurant == null) {
            return null;
        }

        Map<String, List<MenuItemDTO>> menuMap = new HashMap<>();
        if (restaurant.getMenuItems() != null) {
            menuMap = restaurant.getMenuItems().stream()
                    .collect(Collectors.groupingBy(
                            item -> item.getCategory() != null ? item.getCategory() : "Other",
                            Collectors.mapping(this::toMenuItemDTO, Collectors.toList())
                    ));
        }

        return RestaurantDTO.builder()
                .id(restaurant.getId())
                .name(restaurant.getName())
                .slug(restaurant.getSlug())
                .address(restaurant.getAddress())
                .description(restaurant.getDescription())
                .image(restaurant.getImage())
                .category(restaurant.getCategory())
                .averagePrice(restaurant.getAveragePrice())
                .lat(restaurant.getLat())
                .lon(restaurant.getLon())
                .highlights(restaurant.getHighlights())
                .menu(menuMap)
                .ownerId(restaurant.getOwnerId())
                .build();
    }

    public MenuItemDTO toMenuItemDTO(MenuItem menuItem) {
        if (menuItem == null) {
            return null;
        }
        return MenuItemDTO.builder()
                .id(menuItem.getId())
                .title(menuItem.getName())
                .description(menuItem.getDescription())
                .price(menuItem.getPrice())
                .imageUrl(menuItem.getImageUrl())
                .build();
    }
    
    public Restaurant toEntity(RestaurantDTO dto) {
        if (dto == null) {
            return null;
        }
        // Basic mapping, ignoring menu items for now as they are usually handled separately or need complex logic
        return Restaurant.builder()
                .id(dto.getId())
                .name(dto.getName())
                .slug(dto.getSlug())
                .address(dto.getAddress())
                .description(dto.getDescription())
                .image(dto.getImage())
                .category(dto.getCategory())
                .averagePrice(dto.getAveragePrice())
                .lat(dto.getLat())
                .lon(dto.getLon())
                .highlights(dto.getHighlights())
                .ownerId(dto.getOwnerId())
                .build();
    }
}
