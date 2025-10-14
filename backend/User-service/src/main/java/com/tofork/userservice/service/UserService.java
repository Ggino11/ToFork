package com.tofork.userservice.service;

import com.tofork.userservice.auth.jwt.JwtService;
import com.tofork.userservice.dto.ApiResponse;
import com.tofork.userservice.dto.LoginRequest;
import com.tofork.userservice.dto.RegisterRequest;
import com.tofork.userservice.model.AuthProvider;
import com.tofork.userservice.model.Role;
import com.tofork.userservice.model.User;
import com.tofork.userservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    public ApiResponse<Map<String, Object>> register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ApiResponse.error("Email già utilizzata");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setFirstName(request.getEffectiveFirstName());
        user.setLastName(request.getEffectiveLastName());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setProvider(AuthProvider.LOCAL);
        user.setRole(request.getRole());

        User savedUser = userRepository.save(user);
        String token = jwtService.generateToken(savedUser);

        Map<String, Object> authData = new HashMap<>();
        authData.put("token", token);
        authData.put("type", "Bearer");
        authData.put("user", createUserResponse(savedUser));

        return ApiResponse.success("Registrazione completata", authData);
    }

    public ApiResponse<Map<String, Object>> login(LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmailAndProvider(request.getEmail(), AuthProvider.LOCAL);

        if (userOpt.isEmpty() || !passwordEncoder.matches(request.getPassword(), userOpt.get().getPassword())) {
            return ApiResponse.error("Credenziali non valide");
        }

        User user = userOpt.get();
        String token = jwtService.generateToken(user);

        Map<String, Object> authData = new HashMap<>();
        authData.put("token", token);
        authData.put("type", "Bearer");
        authData.put("user", createUserResponse(user));

        return ApiResponse.success("Login effettuato", authData);
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

    public Map<String, Object> processOAuthUser(OAuth2User oauth2User) {
        String email = oauth2User.getAttribute("email");
        String firstName = oauth2User.getAttribute("given_name");
        String lastName = oauth2User.getAttribute("family_name");
        String googleId = oauth2User.getAttribute("sub");
        String profileImage = oauth2User.getAttribute("picture");

        Optional<User> existingUser = userRepository.findByGoogleId(googleId);

        User user;
        if (existingUser.isPresent()) {
            user = existingUser.get();
            user.setFirstName(firstName);
            user.setLastName(lastName);
        } else {
            user = new User();
            user.setEmail(email);
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setGoogleId(googleId);
            user.setRole(Role.CUSTOMER);
            user.setProvider(AuthProvider.GOOGLE);
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
}
