package com.tofork.restaurantservice.service;

import com.tofork.restaurantservice.dto.MenuItemDTO;
import com.tofork.restaurantservice.mapper.RestaurantMapper;
import com.tofork.restaurantservice.model.MenuItem;
import com.tofork.restaurantservice.model.Restaurant;
import com.tofork.restaurantservice.repository.MenuItemRepository;
import com.tofork.restaurantservice.repository.RestaurantRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MenuItemService {

    private final MenuItemRepository repository;
    private final RestaurantRepository restaurantRepository;
    private final RestaurantMapper mapper;

    public MenuItemService(MenuItemRepository repository, RestaurantRepository restaurantRepository, RestaurantMapper mapper) {
        this.repository = repository;
        this.restaurantRepository = restaurantRepository;
        this.mapper = mapper;
    }

    public List<MenuItemDTO> getByRestaurantId(Long restaurantId) {
        return repository.findByRestaurantId(restaurantId).stream()
                .map(mapper::toMenuItemDTO)
                .collect(Collectors.toList());
    }

    public MenuItemDTO add(Long restaurantId, MenuItemDTO dto) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        MenuItem menuItem = MenuItem.builder()
                .name(dto.getTitle())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .imageUrl(dto.getImageUrl())
                .restaurant(restaurant)
                .available(true)
                .build();
        
        // Category handling if needed, assuming it's part of MenuItem model but not DTO yet?
        // Checking MenuItem model... it has 'category'. DTO doesn't seem to have it explicitly in previous check?
        // Let's check MenuItemDTO again.
        
        return mapper.toMenuItemDTO(repository.save(menuItem));
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
