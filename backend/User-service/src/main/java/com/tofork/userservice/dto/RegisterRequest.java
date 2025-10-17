package com.tofork.userservice.dto;

import com.tofork.userservice.model.Role;

public class RegisterRequest {
    // Campi comuni per tutti
    private String firstName;
    private String lastName;
    private String email;
    private String password;

    // Campi specifici per ristoratori (se presenti = è un ristoratore)
    private String restaurantName;
    private String address;
    private String adminFirstName;
    private String adminLastName;
    private String userType;

    public RegisterRequest() {}

    /**
     * Determina automaticamente se è registrazione ristoratore
     * Se restaurantName è presente, è un ristoratore
     */
    public boolean isRestaurantRegistration() {
        return restaurantName != null && !restaurantName.trim().isEmpty();
    }

    /**
     * Ritorna il Role appropriato basandosi sui campi
     */
    public Role getRole() {
        return isRestaurantRegistration() ? Role.RESTAURANT_OWNER : Role.CUSTOMER;
    }

    /**
     * Per registrazione ristoratori, usa adminFirstName, altrimenti firstName
     */
    public String getEffectiveFirstName() {
        return isRestaurantRegistration() ? adminFirstName : firstName;
    }

    /**
     * Per registrazione ristoratori, usa adminLastName, altrimenti lastName
     */
    public String getEffectiveLastName() {
        return isRestaurantRegistration() ? adminLastName : lastName;
    }

    // Getters e Setters
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRestaurantName() { return restaurantName; }
    public void setRestaurantName(String restaurantName) { this.restaurantName = restaurantName; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getAdminFirstName() { return adminFirstName; }
    public void setAdminFirstName(String adminFirstName) { this.adminFirstName = adminFirstName; }

    public String getAdminLastName() { return adminLastName; }
    public void setAdminLastName(String adminLastName) { this.adminLastName = adminLastName; }

    public String getUserType() { return userType; }
    public void setUserType(String userType) { this.userType = userType; }
}
