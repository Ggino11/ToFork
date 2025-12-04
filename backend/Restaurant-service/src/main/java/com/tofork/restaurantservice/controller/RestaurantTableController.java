package com.tofork.restaurantservice.controller;

import com.tofork.restaurantservice.model.RestaurantTable;
import com.tofork.restaurantservice.service.RestaurantTableService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tables")
@CrossOrigin(origins = "*")
public class RestaurantTableController {

    private final RestaurantTableService service;

    public RestaurantTableController(RestaurantTableService service) {
        this.service = service;
    }

    @GetMapping("/restaurant/{restaurantId}")
    public List<RestaurantTable> getByRestaurantId(@PathVariable Long restaurantId) {
        return service.getByRestaurantId(restaurantId);
    }

    @PostMapping("/restaurant/{restaurantId}")
    public RestaurantTable add(@PathVariable Long restaurantId, @RequestBody RestaurantTable table) {
        return service.add(restaurantId, table);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            System.out.println("Deleting table with id: " + id);
            service.delete(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            // Get root cause
            Throwable rootCause = e;
            while (rootCause.getCause() != null && rootCause.getCause() != rootCause) {
                rootCause = rootCause.getCause();
            }
            return ResponseEntity.status(500).body("Error: " + e.getMessage() + " | Root Cause: " + rootCause.getMessage());
        }
    }
}
