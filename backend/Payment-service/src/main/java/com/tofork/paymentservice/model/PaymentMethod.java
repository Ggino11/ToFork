package com.tofork.paymentservice.model;

public enum PaymentMethod {
    STRIPE_CARD("Carta di Credito/Debito"),
    STRIPE_PAYPAL("PayPal"),
    STRIPE_APPLE_PAY("Apple Pay"),
    STRIPE_GOOGLE_PAY("Google Pay"),
    CASH_ON_DELIVERY("Contanti");

    private final String displayName;

    PaymentMethod(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
