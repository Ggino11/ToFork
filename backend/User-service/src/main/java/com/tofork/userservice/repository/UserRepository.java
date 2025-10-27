package com.tofork.userservice.repository;

import com.tofork.userservice.model.AuthProvider;
import com.tofork.userservice.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByEmailAndProvider(String email, AuthProvider provider);

    boolean existsByEmail(String email);

    Optional<User> findByGoogleId(String googleId);
}
