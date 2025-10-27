package com.tofork.userservice.service;

import com.tofork.userservice.jwt.JwtService;
import com.tofork.userservice.model.AuthProvider;
import com.tofork.userservice.model.Role;
import com.tofork.userservice.model.User;
import com.tofork.userservice.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class OAuth2Service {

    private static final Logger log = LoggerFactory.getLogger(OAuth2Service.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    public Map<String, Object> processOAuthUser(OAuth2User oauth2User) {
        log.info("🔵 === INIZIO PROCESS OAUTH USER ===");
        System.out.println("🔵 === INIZIO PROCESS OAUTH USER ===");

        try {
            String email = oauth2User.getAttribute("email");
            String firstName = oauth2User.getAttribute("given_name");
            String lastName = oauth2User.getAttribute("family_name");
            String googleId = oauth2User.getAttribute("sub");

            // Fix lastName null
            if (firstName == null || firstName.trim().isEmpty()) {
                firstName = "User";
            }
            if (lastName == null || lastName.trim().isEmpty()) {
                lastName = "";
            }

            log.info("📧 Email: {}", email);
            log.info("👤 Nome: {} {}", firstName, lastName);
            log.info("🆔 Google ID: {}", googleId);

            System.out.println("📧 Email: " + email);
            System.out.println("👤 Nome: " + firstName + " " + lastName);
            System.out.println("🆔 Google ID: " + googleId);

            if (email == null || email.trim().isEmpty()) {
                log.error("❌ Email NULL o vuota!");
                throw new RuntimeException("Email non disponibile da Google");
            }

            Optional<User> existingUser = userRepository.findByGoogleId(googleId);

            User user;
            if (existingUser.isPresent()) {
                log.info("✅ Utente esistente trovato");
                System.out.println("✅ Utente esistente trovato");
                user = existingUser.get();
                user.setFirstName(firstName);
                user.setLastName(lastName);
            } else {
                Optional<User> emailUser = userRepository.findByEmail(email.trim().toLowerCase());

                if (emailUser.isPresent()) {
                    log.info("✅ Utente con email esistente, collego Google ID");
                    System.out.println("✅ Utente con email esistente, collego Google ID");
                    user = emailUser.get();
                    user.setGoogleId(googleId);
                    user.setProvider(AuthProvider.GOOGLE);
                } else {
                    log.info("🆕 Creo NUOVO utente");
                    System.out.println("🆕 Creo NUOVO utente");
                    user = new User();
                    user.setEmail(email.trim().toLowerCase());
                    user.setFirstName(firstName);
                    user.setLastName(lastName);
                    user.setGoogleId(googleId);
                    user.setRole(Role.CUSTOMER);
                    user.setProvider(AuthProvider.GOOGLE);
                }
            }

            log.info("💾 Salvataggio utente...");
            System.out.println("💾 Salvataggio utente...");
            User savedUser = userRepository.save(user);
            log.info("✅ Utente salvato con ID: {}", savedUser.getId());
            System.out.println("✅ Utente salvato con ID: " + savedUser.getId());

            log.info("🔑 Generazione JWT...");
            System.out.println("🔑 Generazione JWT...");
            String token = jwtService.generateToken(savedUser);
            log.info("✅ JWT generato");
            System.out.println("✅ JWT generato");

            Map<String, Object> userData = new HashMap<>();
            userData.put("id", savedUser.getId());
            userData.put("email", savedUser.getEmail());
            userData.put("firstName", savedUser.getFirstName());
            userData.put("lastName", savedUser.getLastName());
            userData.put("role", savedUser.getRole().name());
            userData.put("token", token);

            log.info("✅ === FINE PROCESS OAUTH USER (SUCCESS) ===");
            System.out.println("✅ === FINE PROCESS OAUTH USER (SUCCESS) ===");
            return userData;

        } catch (Exception e) {
            log.error("❌ === ERRORE IN PROCESS OAUTH USER ===");
            log.error("❌ Messaggio: {}", e.getMessage());
            log.error("❌ Stack trace:", e);

            System.err.println("❌ === ERRORE IN PROCESS OAUTH USER ===");
            System.err.println("❌ Messaggio: " + e.getMessage());
            e.printStackTrace();

            throw new RuntimeException("Errore OAuth: " + e.getMessage(), e);
        }
    }
}
