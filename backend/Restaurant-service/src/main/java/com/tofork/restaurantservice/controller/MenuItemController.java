package com.tofork.restaurantservice.controller;

import com.tofork.restaurantservice.dto.MenuItemDTO;
import com.tofork.restaurantservice.service.MenuItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu-items")
@CrossOrigin(origins = "*")
public class MenuItemController {

    private final MenuItemService service;

    public MenuItemController(MenuItemService service) {
        this.service = service;
    }

    @GetMapping("/restaurant/{restaurantId}")
    public List<MenuItemDTO> getByRestaurantId(@PathVariable Long restaurantId) {
        return service.getByRestaurantId(restaurantId);
    }

    @PostMapping("/restaurant/{restaurantId}")
    public MenuItemDTO add(@PathVariable Long restaurantId, @RequestBody MenuItemDTO dto) {
        return service.add(restaurantId, dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
