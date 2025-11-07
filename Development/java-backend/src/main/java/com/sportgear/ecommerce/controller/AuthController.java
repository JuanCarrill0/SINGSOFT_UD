package com.sportgear.ecommerce.controller;

import com.sportgear.ecommerce.model.User;
import com.sportgear.ecommerce.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> registerRequest) {
        try {
            User user = new User();
            user.setEmail(registerRequest.get("email"));
            user.setFirstName(registerRequest.get("firstName"));
            user.setLastName(registerRequest.get("lastName"));
            user.setPhoneNumber(registerRequest.get("phoneNumber"));
            
            // Parse dateOfBirth if provided
            String dateOfBirthStr = registerRequest.get("dateOfBirth");
            if (dateOfBirthStr != null && !dateOfBirthStr.isBlank()) {
                try {
                    user.setDateOfBirth(java.time.LocalDate.parse(dateOfBirthStr));
                } catch (Exception e) {
                    return ResponseEntity.badRequest().body(Map.of("error", "Invalid date format. Use YYYY-MM-DD"));
                }
            }
            
            // Set password as passwordHash temporarily - service will encrypt it
            user.setPasswordHash(registerRequest.get("password"));
            
            String token = authService.register(user);
            return ResponseEntity.ok(Map.of(
                "token", token,
                "message", "User registered successfully",
                "user", Map.of(
                    "userid", user.getUserID().toString(),
                    "email", user.getEmail(),
                    "firstName", user.getFirstName() != null ? user.getFirstName() : "",
                    "lastName", user.getLastName() != null ? user.getLastName() : ""
                )
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        try {
            String email = loginRequest.get("email");
            String password = loginRequest.get("password");
            
            Map<String, Object> response = authService.login(email, password);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Endpoint opcional para verificar token
    @GetMapping("/verify")
    public ResponseEntity<?> verifyToken(@RequestHeader("Authorization") String token) {
        try {
            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            // Aquí podrías agregar lógica para verificar el token si lo necesitas
            return ResponseEntity.ok(Map.of("valid", true));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("valid", false));
        }
    }

    // Endpoint para validar usuario por ID (usado por Python backend)
    @GetMapping("/users/{userId}")
    public ResponseEntity<?> getUserById(
            @PathVariable String userId,
            @RequestHeader(value = "Authorization", required = false) String authorization
    ) {
        try {
            java.util.UUID uuid = java.util.UUID.fromString(userId);
            Optional<User> userOpt = authService.getUserById(uuid);
            
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of("error", "User not found"));
            }
            
            User user = userOpt.get();
            return ResponseEntity.ok(Map.of(
                "userid", user.getUserID().toString(),
                "email", user.getEmail(),
                "firstName", user.getFirstName() != null ? user.getFirstName() : "",
                "lastName", user.getLastName() != null ? user.getLastName() : "",
                "phoneNumber", user.getPhoneNumber() != null ? user.getPhoneNumber() : ""
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid UUID format"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Internal server error"));
        }
    }
}