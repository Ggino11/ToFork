package com.tofork.paymentservice.dto;

import java.math.BigDecimal;
import java.util.Map;

public class StripePaymentRequest {
    private BigDecimal amount;
    private String currency = "EUR";
    private String description;
    private String customerEmail;
    private Map<String, String> metadata;
    private String returnUrl;
    private String cancelUrl;

    public StripePaymentRequest() {}

    public StripePaymentRequest(BigDecimal amount, String currency, String description, String customerEmail) {
        this.amount = amount;
        this.currency = currency;
        this.description = description;
        this.customerEmail = customerEmail;
    }

    // Getters and Setters
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

    public Map<String, String> getMetadata() { return metadata; }
    public void setMetadata(Map<String, String> metadata) { this.metadata = metadata; }

    public String getReturnUrl() { return returnUrl; }
    public void setReturnUrl(String returnUrl) { this.returnUrl = returnUrl; }

    public String getCancelUrl() { return cancelUrl; }
    public void setCancelUrl(String cancelUrl) { this.cancelUrl = cancelUrl; }
}
