package com.tofork.restaurant.controller;

import com.tofork.restaurant.model.RestaurantModel;
import com.tofork.restaurant.service.RestaurantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {
    @Autowired
    private RestaurantService service;

    @GetMapping
    public List<RestaurantModel> getAll(@RequestParam(required = false) String query) {
        if (query != null && !query.isEmpty()) return service.search(query);
        return service.getAll();
    }

    @PostMapping
    public RestaurantModel add(@RequestBody RestaurantModel r) {
        return service.add(r);
    }
}
