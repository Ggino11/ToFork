package com.tofork.bookingservice.model;

public enum BookingStatus {
    PENDING("In attesa"),
    CONFIRMED("Confermata"),
    CANCELLED("Cancellata"),
    COMPLETED("Completata"),
    NO_SHOW("Mancata presentazione");

    private final String displayName;

    BookingStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
