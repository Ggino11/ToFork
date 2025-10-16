package com.tofork.orderservice.dto;

import com.tofork.orderservice.model.OrderStatus;
import com.tofork.orderservice.model.PaymentStatus;

public class UpdateOrderStatusRequest {
    private OrderStatus orderStatus;
    private PaymentStatus paymentStatus;
    private String notes;

    public UpdateOrderStatusRequest() {}

    public UpdateOrderStatusRequest(OrderStatus orderStatus, PaymentStatus paymentStatus, String notes) {
        this.orderStatus = orderStatus;
        this.paymentStatus = paymentStatus;
        this.notes = notes;
    }

    // Validation method
    public boolean isValid() {
        return orderStatus != null || paymentStatus != null;
    }

    // Getters and Setters
    public OrderStatus getOrderStatus() {
        return orderStatus;
    }

    public void setOrderStatus(OrderStatus orderStatus) {
        this.orderStatus = orderStatus;
    }

    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
