package com.tofork.orderservice.dto;

import java.math.BigDecimal;

public class OrderItemRequest {
    private Long foodItemId;
    private String foodItemName;
    private Integer quantity;
    private BigDecimal unitPrice;
    private String specialRequests;

    public OrderItemRequest() {}

    public OrderItemRequest(Long foodItemId, String foodItemName, Integer quantity,
                            BigDecimal unitPrice, String specialRequests) {
        this.foodItemId = foodItemId;
        this.foodItemName = foodItemName;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.specialRequests = specialRequests;
    }

    // Getters and Setters
    public Long getFoodItemId() {
        return foodItemId;
    }

    public void setFoodItemId(Long foodItemId) {
        this.foodItemId = foodItemId;
    }

    public String getFoodItemName() {
        return foodItemName;
    }

    public void setFoodItemName(String foodItemName) {
        this.foodItemName = foodItemName;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public String getSpecialRequests() {
        return specialRequests;
    }

    public void setSpecialRequests(String specialRequests) {
        this.specialRequests = specialRequests;
    }
}
