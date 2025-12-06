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
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private JwtService jwtService;

    // Helper class for Auth Info
    private static class AuthInfo {
        Long userId;
        String role;
        String token;
    }

    private AuthInfo validateAndExtract(String authHeader) throws Exception {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new Exception("Token non valido o assente");
        }
        String token = authHeader.substring(7);
        if (!jwtService.validateToken(token)) {
            throw new Exception("Token scaduto o non valido");
        }
        AuthInfo info = new AuthInfo();
        info.token = token;
        info.userId = jwtService.getUserIdFromToken(token);
        info.role = jwtService.getRoleFromToken(token);
        return info;
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<ApiResponse<Booking>> getBookingById(
            @PathVariable Long bookingId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            AuthInfo auth = validateAndExtract(authHeader);
            if (!bookingService.canUserAccessBooking(bookingId, auth.userId, auth.role)) {
                return ResponseEntity.ok(ApiResponse.error("Non autorizzato"));
            }
            return ResponseEntity.ok(ApiResponse.success("Trovata", bookingService.findBookingById(bookingId)));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<Booking>>> getUserBookings(
            @PathVariable Long userId,
            @RequestParam(required = false) String status,
            @RequestHeader("Authorization") String authHeader) {
        try {
            AuthInfo auth = validateAndExtract(authHeader);
            if (!auth.userId.equals(userId) && !"ADMIN".equals(auth.role)) {
                return ResponseEntity.ok(ApiResponse.error("Non autorizzato"));
            }
            List<Booking> list = (status != null && !status.isEmpty()) 
                ? bookingService.getUserBookingsByStatus(userId, BookingStatus.valueOf(status.toUpperCase())) 
                : bookingService.getUserBookings(userId);
            return ResponseEntity.ok(ApiResponse.success("OK", list));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<ApiResponse<List<Booking>>> getRestaurantBookings(
            @PathVariable Long restaurantId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestHeader("Authorization") String authHeader) {
        try {
            AuthInfo auth = validateAndExtract(authHeader);
            if (!"RESTAURANT_OWNER".equals(auth.role) && !"ADMIN".equals(auth.role)) {
                return ResponseEntity.ok(ApiResponse.error("Accesso negato"));
            }

            List<Booking> list;
            if (startDate != null && endDate != null) {
                list = bookingService.getRestaurantBookingsByDateRange(restaurantId, 
                    LocalDateTime.parse(startDate, DateTimeFormatter.ISO_LOCAL_DATE_TIME),
                    LocalDateTime.parse(endDate, DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            } else if (status != null && !status.isEmpty()) {
                list = bookingService.getRestaurantBookingsByStatus(restaurantId, BookingStatus.valueOf(status.toUpperCase()));
            } else {
                list = bookingService.getRestaurantBookings(restaurantId);
            }
            return ResponseEntity.ok(ApiResponse.success("OK", list));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/restaurant/{restaurantId}/today")
    public ResponseEntity<ApiResponse<List<Booking>>> getTodayRestaurantBookings(
            @PathVariable Long restaurantId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            AuthInfo auth = validateAndExtract(authHeader);
            if (!"RESTAURANT_OWNER".equals(auth.role) && !"ADMIN".equals(auth.role)) return ResponseEntity.ok(ApiResponse.error("Accesso negato"));
            return ResponseEntity.ok(ApiResponse.success("OK", bookingService.getTodayRestaurantBookings(restaurantId)));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{bookingId}")
    public ResponseEntity<ApiResponse<Booking>> updateBooking(
            @PathVariable Long bookingId,
            @RequestBody UpdateBookingRequest request,
            @RequestHeader("Authorization") String authHeader) {
        try {
            AuthInfo auth = validateAndExtract(authHeader);
            return ResponseEntity.ok(ApiResponse.success("Aggiornato", bookingService.updateBooking(bookingId, request, auth.userId, auth.role)));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{bookingId}/status")
    public ResponseEntity<ApiResponse<Booking>> updateBookingStatus(
            @PathVariable Long bookingId,
            @RequestBody Map<String, String> statusUpdate,
            @RequestHeader("Authorization") String authHeader) {
        try {
            AuthInfo auth = validateAndExtract(authHeader);
            String status = statusUpdate.get("status");
            if (status == null) return ResponseEntity.ok(ApiResponse.error("Status mancante"));
            
            UpdateBookingRequest req = new UpdateBookingRequest();
            req.setStatus(BookingStatus.valueOf(status.toUpperCase()));
            return ResponseEntity.ok(ApiResponse.success("Stato aggiornato", bookingService.updateBooking(bookingId, req, auth.userId, auth.role)));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{bookingId}/cancel")
    public ResponseEntity<ApiResponse<Object>> cancelBooking(
            @PathVariable Long bookingId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            AuthInfo auth = validateAndExtract(authHeader);
            bookingService.cancelBooking(bookingId, auth.userId);
            return ResponseEntity.ok(ApiResponse.success("Cancellata", null));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Booking>> createBooking(
            @RequestBody CreateBookingRequest request,
            @RequestHeader("Authorization") String authHeader) {
        try {
            AuthInfo auth = validateAndExtract(authHeader);
            if (!auth.userId.equals(request.getUserId())) return ResponseEntity.ok(ApiResponse.error("User ID mismatch"));
            
            request.setUserEmail(jwtService.getEmailFromToken(auth.token));
            request.setUserName(jwtService.getFullNameFromToken(auth.token));
            
            return ResponseEntity.ok(ApiResponse.success("Creata", bookingService.createBooking(request)));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        }
    }
}
