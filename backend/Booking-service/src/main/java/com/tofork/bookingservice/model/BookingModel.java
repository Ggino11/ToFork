package com.tofork.booking.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name="bookings")
public class BookingModel {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private Long restaurantId;
    private LocalDateTime bookingDate;
    private int peopleCount;

    public BookingModel() {}

    public BookingModel(Long userId, Long restaurantId, LocalDateTime bookingDate, int peopleCount) {
        this.userId = userId;
        this.restaurantId = restaurantId;
        this.bookingDate = bookingDate;
        this.peopleCount = peopleCount;
    }
    // getter e setter
}
