package com.tofork.restaurantservice.controller;

import com.tofork.restaurantservice.dto.RestaurantDTO;
import com.tofork.restaurantservice.service.RestaurantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
@CrossOrigin(origins = "*")
public class RestaurantController {
    @Autowired
    private RestaurantService service;

    @Autowired
    private com.tofork.restaurantservice.service.RestaurantTableService tableService;

    @GetMapping
    public List<RestaurantDTO> getAll(@RequestParam(required = false) String query) {
        if (query != null && !query.isEmpty()) return service.search(query);
        return service.getAll();
    }

    @GetMapping("/{id}")
    public RestaurantDTO getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @GetMapping("/slug/{slug}")
    public RestaurantDTO getBySlug(@PathVariable String slug) {
        return service.getBySlug(slug);
    }

    @GetMapping("/owner/{ownerId}")
    public List<RestaurantDTO> getByOwnerId(@PathVariable Long ownerId) {
        return service.getByOwnerId(ownerId);
    }

    @PostMapping
    public RestaurantDTO add(@RequestBody RestaurantDTO r) {
        return service.add(r);
    }

    @PutMapping("/{id}")
    public RestaurantDTO update(@PathVariable Long id, @RequestBody RestaurantDTO r) {
        return service.update(id, r);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @GetMapping("/{id}/capacity")
    public Integer getCapacity(@PathVariable Long id) {
        return service.getRestaurantCapacity(id);
    }

    @GetMapping("/{id}/tables")
    public List<com.tofork.restaurantservice.model.RestaurantTable> getTables(@PathVariable Long id) {
        return tableService.getByRestaurantId(id);
    }
}
