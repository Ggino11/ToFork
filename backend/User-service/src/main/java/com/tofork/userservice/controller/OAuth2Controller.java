package com.tofork.userservice.controller;

import com.tofork.userservice.dto.ApiResponse;
import com.tofork.userservice.service.OAuth2Service;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/oauth2")
@CrossOrigin(origins = "http://localhost:3000")
public class OAuth2Controller {

    private final OAuth2Service oauth2Service;

    public OAuth2Controller(OAuth2Service oauth2Service) {
        this.oauth2Service = oauth2Service;
    }

    @PostMapping("/process")
    public ResponseEntity<ApiResponse<Map<String, Object>>> processOAuth2User(Authentication authentication) {
        try {
            if (authentication == null || !(authentication.getPrincipal() instanceof OAuth2User oauth2User)) {
                return ResponseEntity.ok(ApiResponse.error("Autenticazione OAuth2 non valida"));
            }

            Map<String, Object> userData = oauth2Service.processOAuthUser(oauth2User);

            return ResponseEntity.ok(ApiResponse.success("Login Google effettuato", userData));

        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error("Errore OAuth2: " + e.getMessage()));
        }
    }
}