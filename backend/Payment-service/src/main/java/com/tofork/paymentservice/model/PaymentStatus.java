package com.tofork.paymentservice.model;

public enum PaymentStatus {
    PENDING("In attesa"),
    PROCESSING("In elaborazione"),
    SUCCEEDED("Completato"),
    FAILED("Fallito"),
    CANCELLED("Annullato"),
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
