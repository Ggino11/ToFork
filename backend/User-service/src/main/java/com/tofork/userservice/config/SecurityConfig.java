package com.tofork.userservice.config;

import com.tofork.userservice.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Arrays;
import java.util.Map;

/**
 * SecurityConfig - Configurazione Spring Security + OAuth2
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private UserService userService;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // Disabilita CSRF per API REST
                .csrf(csrf -> csrf.disable())

                // Configura CORS
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // Autorizzazioni
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/**", "/api/auth/**").permitAll()
                        .requestMatchers("/oauth2/**", "/login/oauth2/**").permitAll()
                        .anyRequest().authenticated()
                )

                // Configura OAuth2 con handler inline semplificato
                .oauth2Login(oauth2 -> oauth2
                        .successHandler(oAuth2SuccessHandler())
                );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    /**
     * Handler OAuth2 semplificato inline
     */
    private AuthenticationSuccessHandler oAuth2SuccessHandler() {
        return (HttpServletRequest request, HttpServletResponse response,
                org.springframework.security.core.Authentication authentication) -> {

            OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();

            try {
                Map<String, Object> userData = userService.processOAuthUser(oauth2User);

                String fullName = userData.get("firstName") + " " + userData.get("lastName");

                String redirectUrl = UriComponentsBuilder
                        .fromHttpUrl(frontendUrl + "/auth")
                        .queryParam("token", userData.get("token"))
                        .queryParam("userId", userData.get("id"))
                        .queryParam("email", userData.get("email"))
                        .queryParam("name", fullName.trim())
                        .queryParam("role", userData.get("role"))
                        .build().toUriString();

                response.sendRedirect(redirectUrl);

            } catch (Exception e) {
                response.sendRedirect(frontendUrl + "/auth?error=oauth_failed");
            }
        };
    }
}
