package com.tofork.bookingservice.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

/**
 * SecurityConfig - Configurazione Spring Security per Booking-Service
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // Disabilita CSRF per API REST
                .csrf(csrf -> csrf
                        .ignoringRequestMatchers(AntPathRequestMatcher.antMatcher("/h2-console/**"))
                        .disable())

                // Disabilita frame options per H2 console
                .headers(headers -> headers
                        .frameOptions().sameOrigin())

                // Configura CORS
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // Configura sessioni stateless (JWT-based)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Autorizzazioni
                .authorizeHttpRequests(auth -> auth
                        // Endpoint pubblici
                        .requestMatchers("/actuator/**").permitAll()
                        .requestMatchers("/h2-console/**").permitAll()
                        .requestMatchers("/api/bookings/check-availability").permitAll()

                        // Tutti gli altri endpoint richiedono autenticazione
                        // L'autenticazione JWT verrà gestita manualmente nei controller
                        .anyRequest().permitAll());

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Consenti origini specifiche
        configuration.setAllowedOriginPatterns(Arrays.asList(
                "http://localhost:3000",    // Frontend React
                "http://localhost:8080",    // Gateway o altro servizio
                "http://localhost:8081",    // User-Service
                "http://localhost:8082",    // Order-Service
                frontendUrl                 // URL dinamico dal configuration
        ));

        // Metodi HTTP consentiti
        configuration.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"
        ));

        // Headers consentiti
        configuration.setAllowedHeaders(Arrays.asList("*"));

        // Consenti credenziali (per JWT in Authorization header)
        configuration.setAllowCredentials(true);

        // Esponi headers personalizzati se necessari
        configuration.setExposedHeaders(Arrays.asList(
                "Authorization", "Cache-Control", "Content-Type"
        ));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
