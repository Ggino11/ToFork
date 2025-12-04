package com.tofork.bookingservice.service;

import com.tofork.bookingservice.dto.CreateBookingRequest;
import com.tofork.bookingservice.dto.UpdateBookingRequest;
import com.tofork.bookingservice.model.Booking;
import com.tofork.bookingservice.model.BookingStatus;
import com.tofork.bookingservice.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class BookingServiceImpl implements BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Override
    @Transactional
    public Booking createBooking(CreateBookingRequest request) throws Exception {
        // Validazione input
        if (!request.isValid()) {
            throw new Exception("Dati prenotazione non validi");
        }

        if (!request.isBookingInFuture()) {
            throw new Exception("La prenotazione deve essere nel futuro");
        }

        // Verifica che non ci sia già una prenotazione per lo stesso utente, ristorante e data
        Optional<Booking> existingBooking = bookingRepository.findByUserIdAndRestaurantIdAndBookingDateAndStatus(
                request.getUserId(), request.getRestaurantId(), request.getBookingDate(), BookingStatus.CONFIRMED);

        if (existingBooking.isPresent()) {
            throw new Exception("Hai già una prenotazione confermata per questo ristorante in questa data");
        }

        // Trova un tavolo disponibile
        Long tableId = findAvailableTable(request.getRestaurantId(), request.getBookingDate(), request.getPeopleCount());
        if (tableId == null) {
            throw new Exception("Nessun tavolo disponibile per la data e il numero di persone selezionati");
        }

        // Crea prenotazione
        Booking booking = new Booking();
        booking.setUserId(request.getUserId());
        booking.setUserEmail(request.getUserEmail());
        booking.setUserName(request.getUserName());
        booking.setRestaurantId(request.getRestaurantId());
        booking.setRestaurantName(request.getRestaurantName());
        booking.setBookingDate(request.getBookingDate());
        booking.setPeopleCount(request.getPeopleCount());
        booking.setPhoneNumber(request.getPhoneNumber());
        booking.setSpecialRequests(request.getSpecialRequests());
        booking.setTableId(tableId);
        booking.setStatus(BookingStatus.PENDING);

        return bookingRepository.save(booking);
    }

    @Override
    public Booking findBookingById(Long bookingId) throws Exception {
        Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
        if (bookingOpt.isEmpty()) {
            throw new Exception("Prenotazione non trovata con ID: " + bookingId);
        }
        return bookingOpt.get();
    }

    @Override
    @Transactional
    public Booking updateBooking(Long bookingId, UpdateBookingRequest request, Long userId, String userRole) throws Exception {
        if (!request.isValid()) {
            throw new Exception("Richiesta aggiornamento non valida");
        }

        Booking booking = findBookingById(bookingId);

        // Verifica autorizzazioni
        if (!"ADMIN".equals(userRole) && !"RESTAURANT_OWNER".equals(userRole) && !booking.getUserId().equals(userId)) {
            throw new Exception("Non autorizzato ad aggiornare questa prenotazione");
        }

        // Aggiorna campi se presenti
        if (request.getBookingDate() != null) {
            if (request.getBookingDate().isBefore(LocalDateTime.now())) {
                throw new Exception("La nuova data deve essere nel futuro");
            }
            booking.setBookingDate(request.getBookingDate());
        }

        if (request.getPeopleCount() != null) {
            if (request.getPeopleCount() <= 0) {
                throw new Exception("Il numero di persone deve essere maggiore di 0");
            }
            booking.setPeopleCount(request.getPeopleCount());
        }

        if (request.getPhoneNumber() != null) {
            booking.setPhoneNumber(request.getPhoneNumber());
        }

        if (request.getSpecialRequests() != null) {
            booking.setSpecialRequests(request.getSpecialRequests());
        }

        // Solo ristoratori e admin possono cambiare lo stato
        if (request.getStatus() != null) {
            if ("CUSTOMER".equals(userRole)) {
                throw new Exception("I clienti non possono modificare lo stato della prenotazione");
            }
            booking.setStatus(request.getStatus());
        }

        return bookingRepository.save(booking);
    }

    @Override
    @Transactional
    public void cancelBooking(Long bookingId, Long userId) throws Exception {
        Booking booking = findBookingById(bookingId);

        // Verifica che la prenotazione appartenga all'utente
        if (!booking.getUserId().equals(userId)) {
            throw new Exception("Non autorizzato a cancellare questa prenotazione");
        }

        // Verifica che la prenotazione possa essere cancellata
        if (!booking.canBeCancelled()) {
            throw new Exception("Prenotazione non può essere cancellata nello stato attuale: " + booking.getStatus());
        }

        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
    }

    @Override
    public List<Booking> getUserBookings(Long userId) {
        return bookingRepository.findByUserIdOrderByBookingDateDesc(userId);
    }

    @Override
    public List<Booking> getUserBookingsByStatus(Long userId, BookingStatus status) {
        return bookingRepository.findByUserIdAndStatusOrderByBookingDateDesc(userId, status);
    }

    @Override
    public List<Booking> getRestaurantBookings(Long restaurantId) {
        return bookingRepository.findByRestaurantIdOrderByBookingDateDesc(restaurantId);
    }

    @Override
    public List<Booking> getRestaurantBookingsByStatus(Long restaurantId, BookingStatus status) {
        return bookingRepository.findByRestaurantIdAndStatusOrderByBookingDateDesc(restaurantId, status);
    }

    @Override
    public List<Booking> getRestaurantBookingsByDateRange(Long restaurantId, LocalDateTime startDate, LocalDateTime endDate) {
        return bookingRepository.findByRestaurantIdAndBookingDateBetweenOrderByBookingDateAsc(restaurantId, startDate, endDate);
    }

    @Override
    public List<Booking> getTodayRestaurantBookings(Long restaurantId) {
        return bookingRepository.findTodayBookingsByRestaurant(restaurantId, LocalDateTime.now());
    }

    @Override
    public boolean canUserAccessBooking(Long bookingId, Long userId, String userRole) throws Exception {
        if ("ADMIN".equals(userRole)) {
            return true;
        }

        Booking booking = findBookingById(bookingId);
        return booking.getUserId().equals(userId);
    }

    @Override
    public boolean canRestaurantAccessBooking(Long bookingId, Long restaurantId) throws Exception {
        Booking booking = findBookingById(bookingId);
        return booking.getRestaurantId().equals(restaurantId);
    }

    @Autowired
    private org.springframework.web.client.RestTemplate restTemplate;

    @Override
    public boolean checkAvailability(Long restaurantId, LocalDateTime date, Integer peopleCount) {
        try {
            // 1. Fetch tables from Restaurant-service
            String url = "http://restaurant-service:8083/api/restaurants/" + restaurantId + "/tables";
            org.springframework.core.ParameterizedTypeReference<List<com.tofork.bookingservice.dto.RestaurantTableDTO>> responseType = 
                new org.springframework.core.ParameterizedTypeReference<>() {};
            org.springframework.http.ResponseEntity<List<com.tofork.bookingservice.dto.RestaurantTableDTO>> response = 
                restTemplate.exchange(url, org.springframework.http.HttpMethod.GET, null, responseType);
            
            List<com.tofork.bookingservice.dto.RestaurantTableDTO> tables = response.getBody();

            if (tables == null || tables.isEmpty()) {
                return false;
            }

            // 2. Find a suitable table
            for (com.tofork.bookingservice.dto.RestaurantTableDTO table : tables) {
                if (table.getSeats() >= peopleCount) {
                    // Check for overlaps
                    List<Booking> overlaps = bookingRepository.findOverlappingBookings(table.getId(), date, date.plusHours(2));
                    if (overlaps.isEmpty()) {
                        return true; // Found a table!
                    }
                }
            }
            
            return false; // No table found

        } catch (Exception e) {
            System.err.println("Error checking availability: " + e.getMessage());
            return false;
        }
    }

    private Long findAvailableTable(Long restaurantId, LocalDateTime date, Integer peopleCount) {
        try {
            String url = "http://restaurant-service:8083/api/restaurants/" + restaurantId + "/tables";
            org.springframework.core.ParameterizedTypeReference<List<com.tofork.bookingservice.dto.RestaurantTableDTO>> responseType = 
                new org.springframework.core.ParameterizedTypeReference<>() {};
            org.springframework.http.ResponseEntity<List<com.tofork.bookingservice.dto.RestaurantTableDTO>> response = 
                restTemplate.exchange(url, org.springframework.http.HttpMethod.GET, null, responseType);
            
            List<com.tofork.bookingservice.dto.RestaurantTableDTO> tables = response.getBody();

            if (tables != null) {
                for (com.tofork.bookingservice.dto.RestaurantTableDTO table : tables) {
                    if (table.getSeats() >= peopleCount) {
                        List<Booking> overlaps = bookingRepository.findOverlappingBookings(table.getId(), date, date.plusHours(2));
                        if (overlaps.isEmpty()) {
                            return table.getId();
                        }
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Error finding table: " + e.getMessage());
        }
        return null;
    }
}
