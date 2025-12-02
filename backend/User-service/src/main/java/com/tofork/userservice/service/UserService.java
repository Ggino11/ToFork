package com.tofork.userservice.service;

import com.tofork.userservice.jwt.JwtService;
import com.tofork.userservice.dto.ApiResponse;
import com.tofork.userservice.dto.LoginRequest;
import com.tofork.userservice.dto.RegisterRequest;
import com.tofork.userservice.model.AuthProvider;
import com.tofork.userservice.model.User;
import com.tofork.userservice.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final WebClient.Builder webClientBuilder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService, WebClient.Builder webClientBuilder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.webClientBuilder = webClientBuilder;
    }

    public ApiResponse<Map<String, Object>> register(RegisterRequest request) {
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            return ApiResponse.error("Email richiesta");
        }
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            return ApiResponse.error("Password richiesta");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            return ApiResponse.error("Email già utilizzata");
        }

        User user = new User();
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setFirstName(request.getEffectiveFirstName());
        user.setLastName(request.getEffectiveLastName());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setProvider(AuthProvider.LOCAL);
        user.setRole(request.getRole());

        User savedUser = userRepository.save(user);

        if (request.isRestaurantRegistration()) {
            createRestaurantForUser(savedUser, request);
        }

        return createAuthenticationResponse("Registrazione avvenuta con successo", savedUser);
    }

    public ApiResponse<Map<String, Object>> login(LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmailAndProvider(
                request.getEmail().trim().toLowerCase(), AuthProvider.LOCAL);

        if (userOpt.isEmpty()) {
            return ApiResponse.error("Credenziali non valide");
        }

        User user = userOpt.get();

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ApiResponse.error("Credenziali non valide");
        }

        return createAuthenticationResponse("Login effettuato con successo", user);
    }

    public Map<String, Object> validateToken(String token) {
        Map<String, Object> response = new HashMap<>();
        if (!jwtService.validateToken(token)) {
            response.put("valid", false);
            response.put("user", null);
            return response;
        }

        String email = jwtService.getEmailFromToken(token);
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            response.put("valid", false);
            response.put("user", null);
            return response;
        }

        response.put("valid", true);
        response.put("user", createUserResponse(userOpt.get()));
        return response;
    }

    private ApiResponse<Map<String, Object>> createAuthenticationResponse(String message, User user) {
        String token = jwtService.generateToken(user);

        Map<String, Object> authData = new HashMap<>();
        authData.put("token", token);
        authData.put("type", "Bearer");
        authData.put("user", createUserResponse(user));

        return ApiResponse.success(message, authData);
    }

    private Map<String, Object> createUserResponse(User user) {
        Map<String, Object> userResponse = new HashMap<>();
        userResponse.put("id", user.getId());
        userResponse.put("email", user.getEmail());
        userResponse.put("firstName", user.getFirstName());
        userResponse.put("lastName", user.getLastName());
        userResponse.put("role", user.getRole().name());
        userResponse.put("provider", user.getProvider().name());

        return userResponse;
    }

    private void createRestaurantForUser(User user, RegisterRequest request) {
        try {
            Map<String, Object> restaurantPayload = new HashMap<>();
            restaurantPayload.put("name", request.getRestaurantName());
            restaurantPayload.put("address", request.getAddress());
            restaurantPayload.put("description", request.getDescription());
            restaurantPayload.put("category", request.getCategory());
            restaurantPayload.put("ownerId", user.getId());
            // Generate slug
            String slug = request.getRestaurantName().toLowerCase().replaceAll("[^a-z0-9]", "-") + "-" + user.getId();
            restaurantPayload.put("slug", slug);

            System.out.println("Creating restaurant with payload: " + restaurantPayload);

            String response = webClientBuilder.build()
                    .post()
                    .uri("http://restaurant-service:8083/api/restaurants")
                    .bodyValue(restaurantPayload)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block(); // Synchronous call

            System.out.println("Restaurant created successfully: " + response);
        } catch (Exception e) {
            System.err.println("Failed to create restaurant: " + e.getMessage());
            e.printStackTrace();
            
        }
    }
}