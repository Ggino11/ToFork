package com.tofork.userservice.auth;

import com.tofork.userservice.jwt.JwtService;
import com.tofork.userservice.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    public JwtAuthenticationFilter(JwtService jwtService, UserRepository userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        System.out.println("--- [DEBUG] JwtAuthenticationFilter: Inizio del filtro ---");

        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("--- [DEBUG] JwtAuthenticationFilter: Header assente o non Bearer. Passo al prossimo filtro.");
            filterChain.doFilter(request, response);
            return;
        }

        final String jwt = authHeader.substring(7);
        System.out.println("--- [DEBUG] JwtAuthenticationFilter: Token estratto: " + jwt);

        final String userEmail = jwtService.getEmailFromToken(jwt);
        System.out.println("--- [DEBUG] JwtAuthenticationFilter: Email estratta dal token: " + userEmail);


        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            System.out.println("--- [DEBUG] JwtAuthenticationFilter: L'utente non è ancora autenticato. Cerco nel database...");

            if (jwtService.validateToken(jwt)) {
                System.out.println("--- [DEBUG] JwtAuthenticationFilter: Token valido. Inizio ricerca utente.");
                userRepository.findByEmail(userEmail).ifPresent(user -> {
                    // Per utenti OAuth2, la password potrebbe essere null
                    String password = user.getPassword() != null ? user.getPassword() : "";
                    System.out.println("--- [DEBUG] JwtAuthenticationFilter: Utente trovato nel database: " + user.getEmail());

                    UserDetails userDetails = new User(user.getEmail(), user.getPassword(), new ArrayList<>());

                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);

                    System.out.println("--- [DEBUG] JwtAuthenticationFilter: Contesto di sicurezza aggiornato per l'utente.");
                });
            } else {
                System.out.println("--- [DEBUG] JwtAuthenticationFilter: Validazione del token fallita.");
            }
        }

        System.out.println("--- [DEBUG] JwtAuthenticationFilter: Fine del filtro. Passo al prossimo filtro.");
        filterChain.doFilter(request, response);
    }
}