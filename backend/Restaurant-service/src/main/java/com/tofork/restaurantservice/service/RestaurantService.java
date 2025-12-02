package com.tofork.restaurantservice.service;

import com.tofork.restaurantservice.dto.RestaurantDTO;
import com.tofork.restaurantservice.mapper.RestaurantMapper;
import com.tofork.restaurantservice.model.Restaurant;
import com.tofork.restaurantservice.repository.RestaurantRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RestaurantService {

    private final RestaurantRepository repository;
    private final RestaurantMapper mapper;

    public RestaurantService(RestaurantRepository repository, RestaurantMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    public RestaurantDTO getById(Long id) {
        return mapper.toDTO(repository.findById(id).orElse(null));
    }

    public RestaurantDTO getBySlug(String slug) {
        return mapper.toDTO(repository.findBySlug(slug).orElse(null));
    }

    public List<RestaurantDTO> getByOwnerId(Long ownerId) {
        return repository.findByOwnerId(ownerId).stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<RestaurantDTO> getAll() {
        return repository.findAll().stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<RestaurantDTO> search(String query) {
        return repository.findByNameContainingIgnoreCase(query).stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    public RestaurantDTO add(RestaurantDTO dto) {
        Restaurant restaurant = mapper.toEntity(dto);
        if (restaurant.getOwnerId() == null) {
             restaurant.setOwnerId(dto.getOwnerId() != null ? dto.getOwnerId() : 1L); // Default if missing
        }
        return mapper.toDTO(repository.save(restaurant));
    }

    public RestaurantDTO update(Long id, RestaurantDTO dto) {
        return repository.findById(id).map(existing -> {
            existing.setName(dto.getName());
            existing.setAddress(dto.getAddress());
            existing.setDescription(dto.getDescription());
            
            // Update new fields
            existing.setSlug(dto.getSlug());
            existing.setImage(dto.getImage());
            existing.setCategory(dto.getCategory());
            existing.setAveragePrice(dto.getAveragePrice());
            existing.setHighlights(dto.getHighlights());
            
            if (dto.getLat() != null && dto.getLon() != null) {
                existing.setLat(dto.getLat());
                existing.setLon(dto.getLon());
            }

            return mapper.toDTO(repository.save(existing));
        }).orElseThrow(() -> new RuntimeException("Restaurant not found"));
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
