package com.sportgear.ecommerce.service;

import com.sportgear.ecommerce.model.User;
import com.sportgear.ecommerce.model.UserRole;
import com.sportgear.ecommerce.repository.UserRepository;
import com.sportgear.ecommerce.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // 🔹 Registro de usuario
    public String register(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        // El passwordHash viene con el password en texto plano desde el controller
        // Necesitamos encriptarlo antes de guardar
        String rawPassword = user.getPasswordHash();
        if (rawPassword == null || rawPassword.isBlank()) {
            throw new RuntimeException("Password is required");
        }
        
        user.setPassword(rawPassword, passwordEncoder);
        user.setRole(UserRole.CUSTOMER);
        userRepository.save(user);

        return jwtUtil.generateToken(user.getEmail());
    }

    // 🔹 Login de usuario
    public Map<String, Object> login(String email, String rawPassword) {
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = userOpt.get();

        if (!passwordEncoder.matches(rawPassword, user.getPasswordHash())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtUtil.generateToken(user.getEmail());
        
        return Map.of(
            "token", token,
            "user", Map.of(
                "userid", user.getUserID().toString(),
                "email", user.getEmail(),
                "firstName", user.getFirstName() != null ? user.getFirstName() : "",
                "lastName", user.getLastName() != null ? user.getLastName() : "",
                "phoneNumber", user.getPhoneNumber() != null ? user.getPhoneNumber() : "",
                "role", user.getRole().name()
            )
        );
    }

    // 🔹 Get user by ID
    public Optional<User> getUserById(UUID userId) {
        return userRepository.findById(userId);
    }
}