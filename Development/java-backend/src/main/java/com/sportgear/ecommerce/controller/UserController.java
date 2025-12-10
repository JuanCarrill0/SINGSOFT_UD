package com.sportgear.ecommerce.controller;

import com.sportgear.ecommerce.model.User;
import com.sportgear.ecommerce.model.UserRole;
import com.sportgear.ecommerce.model.UserStatus;
import com.sportgear.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping
    public ResponseEntity<?> getAllUsers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String status
    ) {
        try {
            List<User> users = userRepository.findAll();

            // Apply filters
            if (search != null && !search.isBlank()) {
                String searchLower = search.toLowerCase();
                users = users.stream()
                        .filter(u -> 
                            u.getEmail().toLowerCase().contains(searchLower) ||
                            (u.getFirstName() != null && u.getFirstName().toLowerCase().contains(searchLower)) ||
                            (u.getLastName() != null && u.getLastName().toLowerCase().contains(searchLower))
                        )
                        .collect(Collectors.toList());
            }

            if (role != null && !role.isBlank()) {
                UserRole roleEnum = UserRole.valueOf(role.toUpperCase());
                users = users.stream()
                        .filter(u -> u.getRole() == roleEnum)
                        .collect(Collectors.toList());
            }

            if (status != null && !status.isBlank()) {
                UserStatus statusEnum = UserStatus.valueOf(status.toUpperCase());
                users = users.stream()
                        .filter(u -> u.getStatus() == statusEnum)
                        .collect(Collectors.toList());
            }

            // Convert to DTO
            List<Map<String, Object>> userDTOs = users.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(userDTOs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable String userId) {
        try {
            UUID uuid = UUID.fromString(userId);
            Optional<User> userOpt = userRepository.findById(uuid);

            if (userOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(convertToDTO(userOpt.get()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid user ID format"));
        }
    }

    @PutMapping("/{userId}/role")
    public ResponseEntity<?> updateUserRole(
            @PathVariable String userId,
            @RequestBody Map<String, String> request
    ) {
        try {
            UUID uuid = UUID.fromString(userId);
            Optional<User> userOpt = userRepository.findById(uuid);

            if (userOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            User user = userOpt.get();
            String newRole = request.get("role");
            
            if (newRole == null || newRole.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Role is required"));
            }

            try {
                UserRole roleEnum = UserRole.valueOf(newRole.toUpperCase());
                user.setRole(roleEnum);
                userRepository.save(user);

                return ResponseEntity.ok(Map.of(
                    "message", "Role updated successfully",
                    "user", convertToDTO(user)
                ));
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid role: " + newRole));
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid user ID format"));
        }
    }

    @PutMapping("/{userId}/status")
    public ResponseEntity<?> updateUserStatus(
            @PathVariable String userId,
            @RequestBody Map<String, String> request
    ) {
        try {
            UUID uuid = UUID.fromString(userId);
            Optional<User> userOpt = userRepository.findById(uuid);

            if (userOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            User user = userOpt.get();
            String newStatus = request.get("status");
            
            if (newStatus == null || newStatus.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Status is required"));
            }

            try {
                UserStatus statusEnum = UserStatus.valueOf(newStatus.toUpperCase());
                user.setStatus(statusEnum);
                userRepository.save(user);

                return ResponseEntity.ok(Map.of(
                    "message", "Status updated successfully",
                    "user", convertToDTO(user)
                ));
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid status: " + newStatus));
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid user ID format"));
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getUserStats() {
        try {
            List<User> users = userRepository.findAll();
            
            Map<String, Long> roleStats = users.stream()
                    .collect(Collectors.groupingBy(u -> u.getRole().toString(), Collectors.counting()));
            
            Map<String, Long> statusStats = users.stream()
                    .collect(Collectors.groupingBy(u -> u.getStatus().toString(), Collectors.counting()));

            return ResponseEntity.ok(Map.of(
                "total", users.size(),
                "roleStats", roleStats,
                "statusStats", statusStats
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{userId}/profile")
    public ResponseEntity<?> updateUserProfile(
            @PathVariable String userId,
            @RequestBody Map<String, String> request
    ) {
        try {
            UUID uuid = UUID.fromString(userId);
            Optional<User> userOpt = userRepository.findById(uuid);

            if (userOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            User user = userOpt.get();

            // Update allowed fields
            if (request.containsKey("firstName")) {
                user.setFirstName(request.get("firstName"));
            }
            if (request.containsKey("lastName")) {
                user.setLastName(request.get("lastName"));
            }
            if (request.containsKey("phoneNumber")) {
                user.setPhoneNumber(request.get("phoneNumber"));
            }
            if (request.containsKey("dateOfBirth") && request.get("dateOfBirth") != null && !request.get("dateOfBirth").isBlank()) {
                try {
                    user.setDateOfBirth(LocalDate.parse(request.get("dateOfBirth")));
                } catch (Exception e) {
                    return ResponseEntity.badRequest().body(Map.of("error", "Invalid date format for dateOfBirth"));
                }
            }

            userRepository.save(user);

            return ResponseEntity.ok(Map.of(
                "message", "Profile updated successfully",
                "user", convertToDTO(user)
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid user ID format"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{userId}/password")
    public ResponseEntity<?> updateUserPassword(
            @PathVariable String userId,
            @RequestBody Map<String, String> request
    ) {
        try {
            UUID uuid = UUID.fromString(userId);
            Optional<User> userOpt = userRepository.findById(uuid);

            if (userOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            User user = userOpt.get();

            String currentPassword = request.get("currentPassword");
            String newPassword = request.get("newPassword");

            if (currentPassword == null || currentPassword.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Current password is required"));
            }

            if (newPassword == null || newPassword.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error", "New password is required"));
            }

            if (newPassword.length() < 6) {
                return ResponseEntity.badRequest().body(Map.of("error", "New password must be at least 6 characters"));
            }

            // Verify current password
            if (!passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
                return ResponseEntity.badRequest().body(Map.of("error", "Current password is incorrect"));
            }

            // Update password
            user.setPassword(newPassword, passwordEncoder);
            userRepository.save(user);

            return ResponseEntity.ok(Map.of(
                "message", "Password updated successfully"
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid user ID format"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    private Map<String, Object> convertToDTO(User user) {
        Map<String, Object> dto = new HashMap<>();
        dto.put("userid", user.getUserID().toString());
        dto.put("email", user.getEmail());
        dto.put("firstName", user.getFirstName());
        dto.put("lastName", user.getLastName());
        dto.put("phoneNumber", user.getPhoneNumber());
        dto.put("dateOfBirth", user.getDateOfBirth() != null ? user.getDateOfBirth().toString() : null);
        dto.put("role", user.getRole() != null ? user.getRole().toString() : "CUSTOMER");
        dto.put("status", user.getStatus() != null ? user.getStatus().toString() : "ACTIVE");
        dto.put("createdAt", user.getCreatedAt() != null ? user.getCreatedAt().toString() : null);
        dto.put("lastLogin", user.getLastLogin() != null ? user.getLastLogin().toString() : null);
        return dto;
    }
}
