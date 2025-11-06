package com.sportgear.ecommerce.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.hibernate.annotations.GenericGenerator;
import org.springframework.security.crypto.password.PasswordEncoder;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "userid", updatable = false, nullable = false)
    private UUID userID;

    @Column(unique = true, nullable = false)
    private String email;

    /**
     * store the hash from the password (BCrypt or similar).
     */
    @Column(nullable = false, name = "password_hash")
    private String passwordHash;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    private UserRole role;

    @Enumerated(EnumType.STRING)
    private UserStatus status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "last_login")
    private LocalDateTime lastLogin;

    /**
     * A user could have more than one address.
     * orphanRemoval = when true delete addresses that be removed from the list.
     */
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Address> addresses = new ArrayList<>();

    /* ---------- Business Methods ---------- */

    /**
     * Registration logic - validates and prepares user for registration
     */
    public boolean register() {
        if (this.email == null || this.email.isBlank() ||
                this.passwordHash == null || this.passwordHash.isBlank()) {
            return false;
        }

        // Basic email validation
        if (!isValidEmail(this.email)) {
            return false;
        }

        this.status = UserStatus.PENDING; // Or ACTIVE based on your business logic
        this.createdAt = LocalDateTime.now();
        return true;
    }

    /**
     * Authentication logic - validates credentials
     */
    public boolean authenticate(String rawPassword,
            org.springframework.security.crypto.password.PasswordEncoder encoder) {
        if (rawPassword == null || encoder == null)
            return false;

        boolean authenticated = validatePassword(rawPassword, encoder);
        if (authenticated) {
            this.lastLogin = LocalDateTime.now();
        }
        return authenticated;
    }

    /**
     * Profile update validation
     */
    public void updateProfile(String firstName, String lastName, String phoneNumber, LocalDate dateOfBirth) {
        if (firstName != null)
            this.firstName = firstName;
        if (lastName != null)
            this.lastName = lastName;
        if (phoneNumber != null)
            this.phoneNumber = phoneNumber;
        if (dateOfBirth != null)
            this.dateOfBirth = dateOfBirth;
    }

    /**
     * Password change logic
     */
    public boolean changePassword(String currentRawPassword,
            String newRawPassword,
            org.springframework.security.crypto.password.PasswordEncoder encoder) {
        if (!validatePassword(currentRawPassword, encoder)) {
            return false;
        }

        if (newRawPassword == null || newRawPassword.length() < 6) {
            return false;
        }

        this.passwordHash = encoder.encode(newRawPassword);
        return true;
    }

    /**
     * Role validation
     */
    public boolean hasRole(UserRole requiredRole) {
        return this.role == requiredRole;
    }

    /**
     * Check if today is user's birthday
     */
    public boolean isBirthday() {
        if (dateOfBirth == null)
            return false;

        LocalDate today = LocalDate.now();
        return today.getMonth() == dateOfBirth.getMonth() &&
                today.getDayOfMonth() == dateOfBirth.getDayOfMonth();
    }

    /**
     * Get user initials for avatars, etc.
     */
    public String getInitials() {
        String fn = (firstName == null || firstName.isBlank()) ? "" : firstName.trim();
        String ln = (lastName == null || lastName.isBlank()) ? "" : lastName.trim();
        StringBuilder initials = new StringBuilder();

        if (!fn.isEmpty())
            initials.append(Character.toUpperCase(fn.charAt(0)));
        if (!ln.isEmpty())
            initials.append(Character.toUpperCase(ln.charAt(0)));

        return initials.length() > 0 ? initials.toString()
                : email != null && !email.isEmpty() ? String.valueOf(Character.toUpperCase(email.charAt(0))) : "U";
    }

    /**
     * Password validation helper
     */
    public boolean validatePassword(String rawPassword,
            org.springframework.security.crypto.password.PasswordEncoder encoder) {
        if (rawPassword == null || passwordHash == null || encoder == null)
            return false;
        return encoder.matches(rawPassword, this.passwordHash);
    }

    /**
     * Add address to user with bidirectional relationship
     */
    public void addAddress(Address address) {
        if (address != null) {
            address.setUser(this);
            this.addresses.add(address);
        }
    }

    /**
     * Remove address from user
     */
    public void removeAddress(Address address) {
        if (address != null) {
            address.setUser(null);
            this.addresses.remove(address);
        }
    }

    /**
     * Email validation
     */
    private boolean isValidEmail(String email) {
        if (email == null)
            return false;
        String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";
        return email.matches(emailRegex);
    }

    /**
     * Age validation (must be at least 18 years old)
     */
    public boolean isOfLegalAge() {
        if (dateOfBirth == null)
            return false;
        return dateOfBirth.plusYears(18).isBefore(LocalDate.now());
    }

    public void setPassword(String rawPassword, PasswordEncoder encoder) {
        this.passwordHash = encoder.encode(rawPassword);
    }

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (status == null) {
            status = UserStatus.PENDING;
        }
        if (role == null) {
            role = UserRole.CUSTOMER;
        }
    }
}