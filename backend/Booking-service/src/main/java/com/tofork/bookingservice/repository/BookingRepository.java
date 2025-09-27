package com.tofork.booking.repository;

import com.tofork.booking.model.BookingModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<BookingModel, Long> {
    List<BookingModel> findByUserId(Long userId);
}
