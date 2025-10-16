package com.tofork.bookingservice.dto;

import com.tofork.bookingservice.model.BookingStatus;
import java.time.LocalDateTime;

public class UpdateBookingRequest {
    private LocalDateTime bookingDate;
    private Integer peopleCount;
    private String phoneNumber;
    private String specialRequests;
    private BookingStatus status;

    public UpdateBookingRequest() {}

    // Validation method
    public boolean isValid() {
        return bookingDate != null || peopleCount != null || status != null ||
                (phoneNumber != null && !phoneNumber.trim().isEmpty()) ||
                specialRequests != null;
    }

    // Getters and Setters
    public LocalDateTime getBookingDate() { return bookingDate; }
    public void setBookingDate(LocalDateTime bookingDate) { this.bookingDate = bookingDate; }

    public Integer getPeopleCount() { return peopleCount; }
    public void setPeopleCount(Integer peopleCount) { this.peopleCount = peopleCount; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getSpecialRequests() { return specialRequests; }
    public void setSpecialRequests(String specialRequests) { this.specialRequests = specialRequests; }

    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }
}
