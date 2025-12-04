package com.tofork.bookingservice.repository;

import com.tofork.bookingservice.model.Booking;
import com.tofork.bookingservice.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    // Check if booking exists for user and restaurant at specific date
    Optional<Booking> findByUserIdAndRestaurantIdAndBookingDateAndStatus(
            Long userId, Long restaurantId, LocalDateTime bookingDate, BookingStatus status);

    // Count bookings by status for a restaurant
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.restaurantId = :restaurantId AND b.status = :status")
    Long countByRestaurantIdAndStatus(@Param("restaurantId") Long restaurantId, @Param("status") BookingStatus status);

    // Count total bookings for a restaurant
    Long countByRestaurantId(Long restaurantId);

    // Count bookings for a user
    Long countByUserId(Long userId);

    // Find upcoming bookings (future bookings)
    @Query("SELECT b FROM Booking b WHERE b.bookingDate > :now ORDER BY b.bookingDate ASC")
    List<Booking> findUpcomingBookings(@Param("now") LocalDateTime now);

    // Find today's bookings for a restaurant
    @Query("SELECT b FROM Booking b WHERE b.restaurantId = :restaurantId AND DATE(b.bookingDate) = DATE(:today) ORDER BY b.bookingDate ASC")
    List<Booking> findTodayBookingsByRestaurant(@Param("restaurantId") Long restaurantId, @Param("today") LocalDateTime today);

    // Find overlapping bookings for a specific table
    @Query("SELECT b FROM Booking b WHERE b.tableId = :tableId " +
           "AND b.status NOT IN ('CANCELLED', 'REJECTED') " +
           "AND b.bookingDate < :endTime AND :startTime < DATEADD('HOUR', 2, b.bookingDate)")
    List<Booking> findOverlappingBookings(@Param("tableId") Long tableId, 
                                          @Param("startTime") LocalDateTime startTime, 
                                          @Param("endTime") LocalDateTime endTime);
}
