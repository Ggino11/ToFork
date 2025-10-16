package com.tofork.bookingservice.service;

import com.tofork.bookingservice.dto.CreateBookingRequest;
import com.tofork.bookingservice.dto.UpdateBookingRequest;
import com.tofork.bookingservice.model.Booking;
import com.tofork.bookingservice.model.BookingStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface BookingService {

    /**
     * Crea una nuova prenotazione
     */
    Booking createBooking(CreateBookingRequest request) throws Exception;

    /**
     * Trova prenotazione per ID
     */
    Booking findBookingById(Long bookingId) throws Exception;

    /**
     * Aggiorna prenotazione
     */
    Booking updateBooking(Long bookingId, UpdateBookingRequest request, Long userId, String userRole) throws Exception;

    /**
     * Cancella prenotazione
     */
    void cancelBooking(Long bookingId, Long userId) throws Exception;

    /**
     * Ottieni tutte le prenotazioni di un utente
     */
    List<Booking> getUserBookings(Long userId);

    /**
     * Ottieni prenotazioni di un utente filtrate per stato
     */
    List<Booking> getUserBookingsByStatus(Long userId, BookingStatus status);

    /**
     * Ottieni tutte le prenotazioni di un ristorante
     */
    List<Booking> getRestaurantBookings(Long restaurantId);

    /**
     * Ottieni prenotazioni di un ristorante filtrate per stato
     */
    List<Booking> getRestaurantBookingsByStatus(Long restaurantId, BookingStatus status);

    /**
     * Ottieni prenotazioni di un ristorante per range di date
     */
    List<Booking> getRestaurantBookingsByDateRange(Long restaurantId, LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Ottieni prenotazioni del giorno per un ristorante
     */
    List<Booking> getTodayRestaurantBookings(Long restaurantId);

    /**
     * Verifica se l'utente può accedere alla prenotazione
     */
    boolean canUserAccessBooking(Long bookingId, Long userId, String userRole) throws Exception;

    /**
     * Verifica se il ristorante può accedere alla prenotazione
     */
    boolean canRestaurantAccessBooking(Long bookingId, Long restaurantId) throws Exception;

    /**
     * Calcola statistiche per un ristorante
     */
    Map<String, Object> getRestaurantStats(Long restaurantId);

    /**
     * Ottieni conteggio prenotazioni per stato per un ristorante
     */
    Map<BookingStatus, Long> getBookingCountsByStatus(Long restaurantId);
}
