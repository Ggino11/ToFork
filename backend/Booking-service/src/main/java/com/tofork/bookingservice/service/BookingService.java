package com.tofork.booking.service;

import com.tofork.booking.model.BookingModel;
import com.tofork.booking.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {
    @Autowired
    private BookingRepository repository;

    public BookingModel book(BookingModel booking) {
        return repository.save(booking);
    }

    public List<BookingModel> getByUser(Long userId) {
        return repository.findByUserId(userId);
    }
}
