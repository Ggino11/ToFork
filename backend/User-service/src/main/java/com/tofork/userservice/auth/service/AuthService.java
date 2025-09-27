package com.tofork.user.auth.service;

import com.tofork.user.auth.jwt.JWTUtil;
import auth.model.UserModel;
import com.tofork.user.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AuthService {
    @Autowired private UserRepository repository;
    @Autowired private JWTUtil jwtUtil;
    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserModel register(UserModel user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return repository.save(user);
    }

    public String login(String email, String password) {
        Optional<UserModel> userOpt = repository.findByEmail(email);
        if (userOpt.isEmpty() || !passwordEncoder.matches(password, userOpt.get().getPassword())) {
            throw new RuntimeException("Credenziali non valide");
        }
        return jwtUtil.generateToken(email);
    }
}
