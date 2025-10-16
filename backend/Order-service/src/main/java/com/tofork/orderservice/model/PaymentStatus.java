package com.tofork.orderservice.model;

public enum PaymentStatus {
    PENDING("In attesa"),
    PAID("Pagato"),
    FAILED("Fallito"),
    REFUNDED("Rimborsato"),
    PARTIALLY_REFUNDED("Parzialmente rimborsato");

    private final String displayName;

    PaymentStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
