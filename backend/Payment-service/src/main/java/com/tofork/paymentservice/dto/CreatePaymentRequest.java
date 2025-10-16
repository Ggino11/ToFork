package com.tofork.paymentservice.dto;

import com.tofork.paymentservice.model.PaymentMethod;
import java.math.BigDecimal;

public class CreatePaymentRequest {
    private Long userId;
    private String userEmail;
    private Long orderId;
    private Long bookingId;
    private BigDecimal amount;
    private String currency = "EUR";
    private PaymentMethod paymentMethod;
    private String description;
    private String returnUrl;
    private String cancelUrl;

    public CreatePaymentRequest() {}

    // metodo Validazione
    public boolean isValid() {
        return userId != null &&
                userEmail != null && !userEmail.trim().isEmpty() &&
                amount != null && amount.compareTo(BigDecimal.ZERO) > 0 &&
                paymentMethod != null &&
                (orderId != null || bookingId != null);
    }

    public boolean isForOrder() {
        return orderId != null;
    }

    public boolean isForBooking() {
        return bookingId != null;
    }

    // Getters and Setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public PaymentMethod getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getReturnUrl() { return returnUrl; }
    public void setReturnUrl(String returnUrl) { this.returnUrl = returnUrl; }

    public String getCancelUrl() { return cancelUrl; }
    public void setCancelUrl(String cancelUrl) { this.cancelUrl = cancelUrl; }
}
