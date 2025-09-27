package com.tofork.restaurant.service;

import com.tofork.restaurant.model.RestaurantModel;
import com.tofork.restaurant.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RestaurantService {
    @Autowired
    private RestaurantRepository repository;

    public List<RestaurantModel> getAll() {
        return repository.findAll();
    }

    public List<RestaurantModel> search(String query) {
        return repository.findByNameContainingIgnoreCase(query);
    }

    public RestaurantModel add(RestaurantModel r) {
        return repository.save(r);
    }
}
