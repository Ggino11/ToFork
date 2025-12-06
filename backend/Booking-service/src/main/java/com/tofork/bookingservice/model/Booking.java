package com.tofork.bookingservice.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "user_email", nullable = false)
    private String userEmail;

    @Column(name = "user_name", nullable = false)
    private String userName;

    @Column(name = "restaurant_id", nullable = false)
    private Long restaurantId;

    @Column(name = "restaurant_name", nullable = false)
    private String restaurantName;

    @Column(name = "table_id")
    private Long tableId;

    @Column(name = "booking_date", nullable = false)
    private LocalDateTime bookingDate;

    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    @Column(name = "people_count", nullable = false)
    private Integer peopleCount;

    @Column(name = "phone_number", length = 20)
    private String phoneNumber;

    @Column(name = "special_requests", length = 1000)
    private String specialRequests;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private BookingStatus status = BookingStatus.PENDING;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Constructors
    public Booking() {}

    public Booking(Long userId, String userEmail, String userName, Long restaurantId,
                   String restaurantName, LocalDateTime bookingDate, Integer peopleCount) {
        this.userId = userId;
        this.userEmail = userEmail;
        this.userName = userName;
        this.restaurantId = restaurantId;
        this.restaurantName = restaurantName;
        this.bookingDate = bookingDate;
        this.peopleCount = peopleCount;
    }

    // Helper methods
    public boolean canBeCancelled() {
        return status == BookingStatus.PENDING || status == BookingStatus.CONFIRMED;
    }

    public boolean isInPast() {
        return bookingDate.isBefore(LocalDateTime.now());
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public Long getTableId() { return tableId; }
    public void setTableId(Long tableId) { this.tableId = tableId; }

    public LocalDateTime getBookingDate() { return bookingDate; }
    public void setBookingDate(LocalDateTime bookingDate) { this.bookingDate = bookingDate; }

    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }

    public Integer getPeopleCount() { return peopleCount; }
    public void setPeopleCount(Integer peopleCount) { this.peopleCount = peopleCount; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getSpecialRequests() { return specialRequests; }
    public void setSpecialRequests(String specialRequests) { this.specialRequests = specialRequests; }

    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
