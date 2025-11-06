package com.sportgear.ecommerce.service;

import com.sportgear.ecommerce.model.User;
import com.sportgear.ecommerce.model.UserRole;
import com.sportgear.ecommerce.repository.UserRepository;
import com.sportgear.ecommerce.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

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

        user.setPassword(user.getPasswordHash(), passwordEncoder);
        user.setRole(UserRole.CUSTOMER);
        userRepository.save(user);

        return jwtUtil.generateToken(user.getEmail());
    }

    // 🔹 Login de usuario
    public String login(String email, String rawPassword) {
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = userOpt.get();

        if (!passwordEncoder.matches(rawPassword, user.getPasswordHash())) {
            throw new RuntimeException("Invalid password");
        }

        return jwtUtil.generateToken(user.getEmail());
    }
}