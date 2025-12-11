package com.tofork.restaurantservice.service;

import com.tofork.restaurantservice.dto.RestaurantDTO;
import com.tofork.restaurantservice.mapper.RestaurantMapper;
import com.tofork.restaurantservice.model.Restaurant;
import com.tofork.restaurantservice.repository.RestaurantRepository;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class RestaurantService {

    private final RestaurantRepository repository;
    private final RestaurantMapper mapper;

    // Inizializziamo RestTemplate per fare chiamate HTTP esterne (Nominatim)
    private final RestTemplate restTemplate = new RestTemplate();

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

    /**
     * Aggiunge un nuovo ristorante e calcola le coordinate
     */
    public RestaurantDTO add(RestaurantDTO dto) {
        Restaurant restaurant = mapper.toEntity(dto);

        if (restaurant.getOwnerId() == null) {
            restaurant.setOwnerId(dto.getOwnerId() != null ? dto.getOwnerId() : 1L); // Default if missing
        }

        // --- GEOCODING AUTOMATICO ---
        // Se c'è un indirizzo, calcoliamo subito Lat e Lon
        if (restaurant.getAddress() != null && !restaurant.getAddress().isEmpty()) {
            updateCoordinates(restaurant);
        }

        return mapper.toDTO(repository.save(restaurant));
    }

    /**
     * Aggiorna un ristorante e ricalcola le coordinate se l'indirizzo cambia
     */
    public RestaurantDTO update(Long id, RestaurantDTO dto) {
        return repository.findById(id).map(existing -> {
            // Controlliamo se l'indirizzo sta cambiando
            boolean addressChanged = !existing.getAddress().equals(dto.getAddress());

            existing.setName(dto.getName());
            existing.setAddress(dto.getAddress());
            existing.setDescription(dto.getDescription());

            // Update new fields
            existing.setSlug(dto.getSlug());
            existing.setImage(dto.getImage());
            existing.setCategory(dto.getCategory());
            existing.setAveragePrice(dto.getAveragePrice());
            existing.setHighlights(dto.getHighlights());

            // Se vengono passate coordinate manuali, usiamo quelle
            if (dto.getLat() != null && dto.getLon() != null) {
                existing.setLat(dto.getLat());
                existing.setLon(dto.getLon());
            }
            // Altrimenti, se l'indirizzo è cambiato o mancano le coordinate, le calcoliamo
            else if (addressChanged || existing.getLat() == null || existing.getLon() == null) {
                updateCoordinates(existing);
            }

            return mapper.toDTO(repository.save(existing));
        }).orElseThrow(() -> new RuntimeException("Restaurant not found"));
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public Integer getRestaurantCapacity(Long restaurantId) {
        return repository.findById(restaurantId)
                .map(restaurant -> restaurant.getTables().stream()
                        .mapToInt(table -> table.getCapacity())
                        .sum())
                .orElse(0);
    }

    /**
     * Metodo privato per ottenere Lat/Lon da Nominatim (OpenStreetMap)
     */
    private void updateCoordinates(Restaurant restaurant) {
        try {
            // Costruiamo l'URL per Nominatim
            // Aggiungiamo ", Torino" per essere più precisi se l'utente non lo mette
            String addressQuery = restaurant.getAddress();
            if (!addressQuery.toLowerCase().contains("torino")) {
                addressQuery += ", Torino";
            }

            String url = "https://nominatim.openstreetmap.org/search?format=json&q=" +
                    addressQuery.replace(" ", "+");

            // Nominatim richiede obbligatoriamente uno User-Agent
            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "ToFork-App-Student-Project");
            HttpEntity<String> entity = new HttpEntity<>(headers);

            // Facciamo la chiamata HTTP GET
            ResponseEntity<List> response = restTemplate.exchange(url, HttpMethod.GET, entity, List.class);

            List<Map<String, Object>> results = response.getBody();

            if (results != null && !results.isEmpty()) {
                // Prendiamo il primo risultato
                Map<String, Object> firstResult = results.get(0);

                // Nominatim restituisce le coordinate come stringhe, le convertiamo in Double
                Double lat = Double.parseDouble(firstResult.get("lat").toString());
                Double lon = Double.parseDouble(firstResult.get("lon").toString());

                restaurant.setLat(lat);
                restaurant.setLon(lon);

                System.out.println("Coordinate aggiornate per " + restaurant.getName() + ": " + lat + ", " + lon);
            } else {
                System.out.println("Nessuna coordinata trovata per: " + restaurant.getAddress());
            }
        } catch (Exception e) {
            // Logghiamo l'errore ma NON blocchiamo il salvataggio del ristorante
            System.err.println("Errore Geocoding per indirizzo " + restaurant.getAddress() + ": " + e.getMessage());
        }
    }
}