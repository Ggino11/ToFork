package com.tofork.paymentservice.dto;

import com.tofork.paymentservice.model.PaymentStatus;
import java.math.BigDecimal;

public class PaymentResponse {
    private Long paymentId;
    private String clientSecret;
    private String checkoutUrl;
    private PaymentStatus status;
    private BigDecimal amount;
    private String currency;
    private String description;

    public PaymentResponse() {}

    public PaymentResponse(Long paymentId, String clientSecret, PaymentStatus status,
                           BigDecimal amount, String currency) {
        this.paymentId = paymentId;
        this.clientSecret = clientSecret;
        this.status = status;
        this.amount = amount;
        this.currency = currency;
    }

    // Getters and Setters
    public Long getPaymentId() { return paymentId; }
    public void setPaymentId(Long paymentId) { this.paymentId = paymentId; }

    public String getClientSecret() { return clientSecret; }
    public void setClientSecret(String clientSecret) { this.clientSecret = clientSecret; }

    public String getCheckoutUrl() { return checkoutUrl; }
    public void setCheckoutUrl(String checkoutUrl) { this.checkoutUrl = checkoutUrl; }

    public PaymentStatus getStatus() { return status; }
    public void setStatus(PaymentStatus status) { this.status = status; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
