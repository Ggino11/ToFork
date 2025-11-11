package com.tofork.userservice.config;

import com.tofork.userservice.auth.JwtAuthenticationFilter;
import com.tofork.userservice.service.OAuth2Service;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;
import java.util.Map;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    @Autowired
    private OAuth2Service oauth2Service;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/**", "/api/auth/**").permitAll()
                        .requestMatchers("/oauth2/**", "/login/oauth2/**").permitAll()
                        .requestMatchers("/h2-console/**").permitAll()
                        .requestMatchers("/api/v1/**").authenticated()
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .headers(headers -> headers.frameOptions(
                        org.springframework.security.config.annotation.web.configurers.HeadersConfigurer.FrameOptionsConfig::sameOrigin
                ))
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
        configuration.setAllowedOriginPatterns(List.of("http://localhost:3000", "http://localhost:8081"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    private AuthenticationSuccessHandler oAuth2SuccessHandler() {
        return (HttpServletRequest request, HttpServletResponse response,
                org.springframework.security.core.Authentication authentication) -> {

            try {
                System.out.println("🟢 === OAuth2 Success Handler chiamato ===");

                OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
                System.out.println("🟢 OAuth2User ottenuto");

                Map<String, Object> userData = oauth2Service.processOAuthUser(oauth2User);
                System.out.println("🟢 UserData processato");

                String fullName = userData.get("firstName") + " " + userData.get("lastName");

                // ⭐ Assicurati che frontendUrl sia corretto
                String redirectUrl = UriComponentsBuilder
                        .fromHttpUrl(frontendUrl + "/auth")
                        .queryParam("token", userData.get("token"))
                        .queryParam("userId", userData.get("id"))
                        .queryParam("email", userData.get("email"))
                        .queryParam("name", fullName.trim())
                        .queryParam("role", userData.get("role"))
                        .build().toUriString();

                System.out.println("🟢 Redirect URL finale: " + redirectUrl);

                // ⭐ Invia il redirect UNA SOLA VOLTA
                response.setStatus(HttpServletResponse.SC_FOUND);
                response.sendRedirect(redirectUrl);
                return; // ⭐ IMPORTANTE: ritorna subito dopo redirect

            } catch (Exception e) {
                System.err.println("❌ ERRORE OAuth2 Success Handler: " + e.getMessage());
                e.printStackTrace();

                try {
                    String errorRedirect = frontendUrl + "/auth?error=oauth_failed";
                    response.setStatus(HttpServletResponse.SC_FOUND);
                    response.sendRedirect(errorRedirect);
                    return; // ⭐ IMPORTANTE: ritorna subito
                } catch (Exception ex) {
                    System.err.println("❌ Errore durante error redirect: " + ex.getMessage());
                }
            }
        };
    }

}
