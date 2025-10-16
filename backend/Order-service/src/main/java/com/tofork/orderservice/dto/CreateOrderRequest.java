package com.tofork.orderservice.dto;

import java.math.BigDecimal;
import java.util.List;

public class CreateOrderRequest {
    private Long userId;
    private String userEmail;
    private String userName;
    private Long restaurantId;
    private String restaurantName;
    private String deliveryAddress;
    private String phoneNumber;
    private String specialInstructions;
    private BigDecimal deliveryFee;
    private BigDecimal taxAmount;
    private List<OrderItemRequest> items;

    public CreateOrderRequest() {}

    // Validation methods
    public boolean isValid() {
        return userId != null &&
                userEmail != null && !userEmail.trim().isEmpty() &&
                userName != null && !userName.trim().isEmpty() &&
                restaurantId != null &&
                restaurantName != null && !restaurantName.trim().isEmpty() &&
                deliveryAddress != null && !deliveryAddress.trim().isEmpty() &&
                phoneNumber != null && !phoneNumber.trim().isEmpty() &&
                items != null && !items.isEmpty();
    }

    public BigDecimal calculateItemsTotal() {
        if (items == null || items.isEmpty()) {
            return BigDecimal.ZERO;
        }

        return items.stream()
                .filter(item -> item.getUnitPrice() != null && item.getQuantity() != null)
                .map(item -> item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    // Getters and Setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Long getRestaurantId() {
        return restaurantId;
    }

    public void setRestaurantId(Long restaurantId) {
        this.restaurantId = restaurantId;
    }

    public String getRestaurantName() {
        return restaurantName;
    }

    public void setRestaurantName(String restaurantName) {
        this.restaurantName = restaurantName;
    }

    public String getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getSpecialInstructions() {
        return specialInstructions;
    }

    public void setSpecialInstructions(String specialInstructions) {
        this.specialInstructions = specialInstructions;
    }

    public BigDecimal getDeliveryFee() {
        return deliveryFee != null ? deliveryFee : BigDecimal.ZERO;
    }

    public void setDeliveryFee(BigDecimal deliveryFee) {
        this.deliveryFee = deliveryFee;
    }

    public BigDecimal getTaxAmount() {
        return taxAmount != null ? taxAmount : BigDecimal.ZERO;
    }

    public void setTaxAmount(BigDecimal taxAmount) {
        this.taxAmount = taxAmount;
    }

    public List<OrderItemRequest> getItems() {
        return items;
    }

    public void setItems(List<OrderItemRequest> items) {
        this.items = items;
    }
}
