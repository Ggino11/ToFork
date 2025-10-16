package com.tofork.bookingservice.controller;

import com.tofork.bookingservice.dto.ApiResponse;
import com.tofork.bookingservice.dto.CreateBookingRequest;
import com.tofork.bookingservice.dto.UpdateBookingRequest;
import com.tofork.bookingservice.jwt.JwtService;
import com.tofork.bookingservice.model.Booking;
import com.tofork.bookingservice.model.BookingStatus;
import com.tofork.bookingservice.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

/**
 * BookingController - Endpoint per gestione prenotazioni ToFork
 */
@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private JwtService jwtService;

    /**
     * POST /api/bookings - Crea nuova prenotazione
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Booking>> createBooking(
            @RequestBody CreateBookingRequest request,
            @RequestHeader("Authorization") String authHeader) {
        try {
            // Validazione token
            if (!isValidAuthHeader(authHeader)) {
                return ResponseEntity.ok(ApiResponse.error("Token non valido"));
            }

            String token = extractToken(authHeader);
            if (!jwtService.validateToken(token)) {
                return ResponseEntity.ok(ApiResponse.error("Token scaduto o non valido"));
            }

            // Estrai info utente dal token
            Long tokenUserId = jwtService.getUserIdFromToken(token);
            String userEmail = jwtService.getEmailFromToken(token);
            String userName = jwtService.getFullNameFromToken(token);

            // Verifica corrispondenza con i dati della richiesta
            if (!tokenUserId.equals(request.getUserId())) {
                return ResponseEntity.ok(ApiResponse.error("ID utente non corrispondente"));
            }

            // Imposta dati utente dal token (più sicuri)
            request.setUserEmail(userEmail);
            request.setUserName(userName);

            Booking createdBooking = bookingService.createBooking(request);
            return ResponseEntity.ok(ApiResponse.success("Prenotazione creata con successo", createdBooking));

        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error("Errore durante creazione prenotazione: " + e.getMessage()));
        }
    }

    /**
     * GET /api/bookings/{bookingId} - Dettagli prenotazione specifica
     */
    @GetMapping("/{bookingId}")
    public ResponseEntity<ApiResponse<Booking>> getBookingById(
            @PathVariable Long bookingId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            if (!isValidAuthHeader(authHeader)) {
                return ResponseEntity.ok(ApiResponse.error("Token non valido"));
            }

            String token = extractToken(authHeader);
            if (!jwtService.validateToken(token)) {
                return ResponseEntity.ok(ApiResponse.error("Token scaduto o non valido"));
            }

            Long userId = jwtService.getUserIdFromToken(token);
            String userRole = jwtService.getRoleFromToken(token);

            // Verifica autorizzazione
            if (!bookingService.canUserAccessBooking(bookingId, userId, userRole)) {
                return ResponseEntity.ok(ApiResponse.error("Non autorizzato ad accedere a questa prenotazione"));
            }

            Booking booking = bookingService.findBookingById(bookingId);
            return ResponseEntity.ok(ApiResponse.success("Prenotazione trovata", booking));

        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error("Errore durante recupero prenotazione: " + e.getMessage()));
        }
    }

    /**
     * GET /api/bookings/user/{userId} - Storico prenotazioni utente
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<Booking>>> getUserBookings(
            @PathVariable Long userId,
            @RequestParam(required = false) String status,
            @RequestHeader("Authorization") String authHeader) {
        try {
            if (!isValidAuthHeader(authHeader)) {
                return ResponseEntity.ok(ApiResponse.error("Token non valido"));
            }

            String token = extractToken(authHeader);
            if (!jwtService.validateToken(token)) {
                return ResponseEntity.ok(ApiResponse.error("Token scaduto o non valido"));
            }

            Long tokenUserId = jwtService.getUserIdFromToken(token);
            String userRole = jwtService.getRoleFromToken(token);

            // Verifica autorizzazione (utente può vedere solo le proprie prenotazioni, admin può vedere tutte)
            if (!tokenUserId.equals(userId) && !"ADMIN".equals(userRole)) {
                return ResponseEntity.ok(ApiResponse.error("Non autorizzato a vedere le prenotazioni di questo utente"));
            }

            List<Booking> bookings;
            if (status != null && !status.trim().isEmpty()) {
                BookingStatus bookingStatus = BookingStatus.valueOf(status.toUpperCase());
                bookings = bookingService.getUserBookingsByStatus(userId, bookingStatus);
            } else {
                bookings = bookingService.getUserBookings(userId);
            }

            return ResponseEntity.ok(ApiResponse.success("Prenotazioni utente recuperate", bookings));

        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error("Errore durante recupero prenotazioni utente: " + e.getMessage()));
        }
    }

    /**
     * GET /api/bookings/restaurant/{restaurantId} - Prenotazioni del ristorante
     */
    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<ApiResponse<List<Booking>>> getRestaurantBookings(
            @PathVariable Long restaurantId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestHeader("Authorization") String authHeader) {
        try {
            if (!isValidAuthHeader(authHeader)) {
                return ResponseEntity.ok(ApiResponse.error("Token non valido"));
            }

            String token = extractToken(authHeader);
            if (!jwtService.validateToken(token)) {
                return ResponseEntity.ok(ApiResponse.error("Token scaduto o non valido"));
            }

            String userRole = jwtService.getRoleFromToken(token);

            // Solo ristoratori e admin possono vedere prenotazioni di ristoranti
            if (!"RESTAURANT_OWNER".equals(userRole) && !"ADMIN".equals(userRole)) {
                return ResponseEntity.ok(ApiResponse.error("Non autorizzato a vedere prenotazioni del ristorante"));
            }

            List<Booking> bookings;

            // Filtra per date se specificate
            if (startDate != null && endDate != null) {
                DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
                LocalDateTime start = LocalDateTime.parse(startDate, formatter);
                LocalDateTime end = LocalDateTime.parse(endDate, formatter);
                bookings = bookingService.getRestaurantBookingsByDateRange(restaurantId, start, end);
            }
            // Filtra per stato se specificato
            else if (status != null && !status.trim().isEmpty()) {
                BookingStatus bookingStatus = BookingStatus.valueOf(status.toUpperCase());
                bookings = bookingService.getRestaurantBookingsByStatus(restaurantId, bookingStatus);
            }
            // Tutte le prenotazioni del ristorante
            else {
                bookings = bookingService.getRestaurantBookings(restaurantId);
            }

            return ResponseEntity.ok(ApiResponse.success("Prenotazioni ristorante recuperate", bookings));

        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error("Errore durante recupero prenotazioni ristorante: " + e.getMessage()));
        }
    }

    /**
     * GET /api/bookings/restaurant/{restaurantId}/today - Prenotazioni di oggi per il ristorante
     */
    @GetMapping("/restaurant/{restaurantId}/today")
    public ResponseEntity<ApiResponse<List<Booking>>> getTodayRestaurantBookings(
            @PathVariable Long restaurantId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            if (!isValidAuthHeader(authHeader)) {
                return ResponseEntity.ok(ApiResponse.error("Token non valido"));
            }

            String token = extractToken(authHeader);
            if (!jwtService.validateToken(token)) {
                return ResponseEntity.ok(ApiResponse.error("Token scaduto o non valido"));
            }

            String userRole = jwtService.getRoleFromToken(token);

            // Solo ristoratori e admin possono vedere prenotazioni
            if (!"RESTAURANT_OWNER".equals(userRole) && !"ADMIN".equals(userRole)) {
                return ResponseEntity.ok(ApiResponse.error("Non autorizzato a vedere prenotazioni del ristorante"));
            }

            List<Booking> bookings = bookingService.getTodayRestaurantBookings(restaurantId);
            return ResponseEntity.ok(ApiResponse.success("Prenotazioni di oggi recuperate", bookings));

        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error("Errore durante recupero prenotazioni di oggi: " + e.getMessage()));
        }
    }

    /**
     * PUT /api/bookings/{bookingId} - Aggiorna prenotazione
     */
    @PutMapping("/{bookingId}")
    public ResponseEntity<ApiResponse<Booking>> updateBooking(
            @PathVariable Long bookingId,
            @RequestBody UpdateBookingRequest request,
            @RequestHeader("Authorization") String authHeader) {
        try {
            if (!isValidAuthHeader(authHeader)) {
                return ResponseEntity.ok(ApiResponse.error("Token non valido"));
            }

            String token = extractToken(authHeader);
            if (!jwtService.validateToken(token)) {
                return ResponseEntity.ok(ApiResponse.error("Token scaduto o non valido"));
            }

            Long userId = jwtService.getUserIdFromToken(token);
            String userRole = jwtService.getRoleFromToken(token);

            Booking updatedBooking = bookingService.updateBooking(bookingId, request, userId, userRole);
            return ResponseEntity.ok(ApiResponse.success("Prenotazione aggiornata", updatedBooking));

        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error("Errore durante aggiornamento prenotazione: " + e.getMessage()));
        }
    }

    /**
     * PUT /api/bookings/{bookingId}/cancel - Cancella prenotazione
     */
    @PutMapping("/{bookingId}/cancel")
    public ResponseEntity<ApiResponse<Object>> cancelBooking(
            @PathVariable Long bookingId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            if (!isValidAuthHeader(authHeader)) {
                return ResponseEntity.ok(ApiResponse.error("Token non valido"));
            }

            String token = extractToken(authHeader);
            if (!jwtService.validateToken(token)) {
                return ResponseEntity.ok(ApiResponse.error("Token scaduto o non valido"));
            }

            Long userId = jwtService.getUserIdFromToken(token);

            bookingService.cancelBooking(bookingId, userId);
            return ResponseEntity.ok(ApiResponse.success("Prenotazione cancellata con successo", null));

        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error("Errore durante cancellazione prenotazione: " + e.getMessage()));
        }
    }

    /**
     * GET /api/bookings/restaurant/{restaurantId}/stats - Statistiche ristorante
     */
    @GetMapping("/restaurant/{restaurantId}/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getRestaurantStats(
            @PathVariable Long restaurantId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            if (!isValidAuthHeader(authHeader)) {
                return ResponseEntity.ok(ApiResponse.error("Token non valido"));
            }

            String token = extractToken(authHeader);
            if (!jwtService.validateToken(token)) {
                return ResponseEntity.ok(ApiResponse.error("Token scaduto o non valido"));
            }

            String userRole = jwtService.getRoleFromToken(token);

            // Solo ristoratori e admin possono vedere statistiche
            if (!"RESTAURANT_OWNER".equals(userRole) && !"ADMIN".equals(userRole)) {
                return ResponseEntity.ok(ApiResponse.error("Non autorizzato a vedere statistiche ristorante"));
            }

            Map<String, Object> stats = bookingService.getRestaurantStats(restaurantId);
            return ResponseEntity.ok(ApiResponse.success("Statistiche ristorante recuperate", stats));

        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error("Errore durante recupero statistiche: " + e.getMessage()));
        }
    }

    // Helper methods
    private boolean isValidAuthHeader(String authHeader) {
        return authHeader != null && authHeader.startsWith("Bearer ");
    }

    private String extractToken(String authHeader) {
        return authHeader.substring(7);
    }
}
