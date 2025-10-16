package com.tofork.bookingservice.dto;

import java.time.LocalDateTime;

public class CreateBookingRequest {
    private Long userId;
    private String userEmail;
    private String userName;
    private Long restaurantId;
    private String restaurantName;
    private LocalDateTime bookingDate;
    private Integer peopleCount;
    private String phoneNumber;
    private String specialRequests;

    public CreateBookingRequest() {}

    // Validation methods
    public boolean isValid() {
        return userId != null &&
                userEmail != null && !userEmail.trim().isEmpty() &&
                userName != null && !userName.trim().isEmpty() &&
                restaurantId != null &&
                restaurantName != null && !restaurantName.trim().isEmpty() &&
                bookingDate != null &&
                peopleCount != null && peopleCount > 0;
    }

    public boolean isBookingInFuture() {
        return bookingDate != null && bookingDate.isAfter(LocalDateTime.now());
    }

    // Getters and Setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public Long getRestaurantId() { return restaurantId; }
    public void setRestaurantId(Long restaurantId) { this.restaurantId = restaurantId; }

    public String getRestaurantName() { return restaurantName; }
    public void setRestaurantName(String restaurantName) { this.restaurantName = restaurantName; }

    public LocalDateTime getBookingDate() { return bookingDate; }
    public void setBookingDate(LocalDateTime bookingDate) { this.bookingDate = bookingDate; }

    public Integer getPeopleCount() { return peopleCount; }
    public void setPeopleCount(Integer peopleCount) { this.peopleCount = peopleCount; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getSpecialRequests() { return specialRequests; }
    public void setSpecialRequests(String specialRequests) { this.specialRequests = specialRequests; }
}
