package com.tofork.restaurantservice.service;

import com.tofork.restaurantservice.model.Restaurant;
import com.tofork.restaurantservice.model.RestaurantTable;
import com.tofork.restaurantservice.model.TableStatus;
import com.tofork.restaurantservice.repository.RestaurantRepository;
import com.tofork.restaurantservice.repository.RestaurantTableRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RestaurantTableService {

    private final RestaurantTableRepository repository;
    private final RestaurantRepository restaurantRepository;

    public RestaurantTableService(RestaurantTableRepository repository, RestaurantRepository restaurantRepository) {
        this.repository = repository;
        this.restaurantRepository = restaurantRepository;
    }

    public List<RestaurantTable> getByRestaurantId(Long restaurantId) {
        return repository.findByRestaurantId(restaurantId);
    }

    public RestaurantTable add(Long restaurantId, RestaurantTable table) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));
        
        table.setRestaurant(restaurant);
        if (table.getStatus() == null) {
            table.setStatus(TableStatus.AVAILABLE);
        }
        return repository.save(table);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
