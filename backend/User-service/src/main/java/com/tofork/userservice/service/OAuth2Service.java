package com.tofork.userservice.service;

import com.tofork.userservice.jwt.JwtService;
import com.tofork.userservice.model.AuthProvider;
import com.tofork.userservice.model.Role;
import com.tofork.userservice.model.User;
import com.tofork.userservice.repository.UserRepository;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class OAuth2Service {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    public OAuth2Service(UserRepository userRepository, JwtService jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    public Map<String, Object> processOAuthUser(OAuth2User oauth2User) {
        String email = oauth2User.getAttribute("email");
        if (email == null || email.trim().isEmpty()) {
            throw new RuntimeException("Email non disponibile da Google");
        }

        String googleId = oauth2User.getAttribute("sub");
        Optional<User> userOptional = userRepository.findByGoogleId(googleId);

        User user = userOptional.orElseGet(() ->
                userRepository.findByEmail(email.trim().toLowerCase())
                        .orElse(new User())
        );

        // Aggiorna o crea l'utente
        user.setEmail(email.trim().toLowerCase());
        user.setFirstName(oauth2User.getAttribute("given_name"));
        user.setLastName(oauth2User.getAttribute("family_name"));
        user.setGoogleId(googleId);
        user.setProvider(AuthProvider.GOOGLE);

        if (user.getId() == null) { // Se è un utente nuovo
            user.setRole(Role.CUSTOMER);
        }

        User savedUser = userRepository.save(user);

        Map<String, Object> userData = new HashMap<>();
        userData.put("id", savedUser.getId());
        userData.put("email", savedUser.getEmail());
        userData.put("firstName", savedUser.getFirstName());
        userData.put("lastName", savedUser.getLastName());
        userData.put("role", savedUser.getRole().name());
        userData.put("token", jwtService.generateToken(savedUser));

        return userData;
    }
}