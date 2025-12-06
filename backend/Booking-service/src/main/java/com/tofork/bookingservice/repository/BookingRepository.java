package com.tofork.bookingservice.repository;

import com.tofork.bookingservice.model.Booking;
import com.tofork.bookingservice.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Find bookings by user ID
    List<Booking> findByUserIdOrderByBookingDateDesc(Long userId);

    // Find bookings by restaurant ID
    List<Booking> findByRestaurantIdOrderByBookingDateDesc(Long restaurantId);
    List<Booking> findByRestaurantIdOrderByBookingDateAsc(Long restaurantId);

    // Find bookings by status
    List<Booking> findByStatusOrderByBookingDateAsc(BookingStatus status);

    // Find bookings by user ID and status
    List<Booking> findByUserIdAndStatusOrderByBookingDateDesc(Long userId, BookingStatus status);

    // Find bookings by restaurant ID and status
    List<Booking> findByRestaurantIdAndStatusOrderByBookingDateDesc(Long restaurantId, BookingStatus status);

    // Find bookings by date range
    List<Booking> findByBookingDateBetweenOrderByBookingDateAsc(LocalDateTime startDate, LocalDateTime endDate);

    // Find bookings by restaurant and date range
    List<Booking> findByRestaurantIdAndBookingDateBetweenOrderByBookingDateAsc(
            Long restaurantId, LocalDateTime startDate, LocalDateTime endDate);

}
