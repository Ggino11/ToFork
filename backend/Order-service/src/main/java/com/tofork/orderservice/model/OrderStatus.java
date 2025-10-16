package com.tofork.orderservice.model;

public enum OrderStatus {
    PENDING("In attesa"),
    CONFIRMED("Confermato"),
    PREPARING("In preparazione"),
    READY("Pronto"),
    OUT_FOR_DELIVERY("In consegna"),
    DELIVERED("Consegnato"),
    CANCELLED("Annullato"),
    REJECTED("Rifiutato");

    private final String displayName;

    OrderStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
