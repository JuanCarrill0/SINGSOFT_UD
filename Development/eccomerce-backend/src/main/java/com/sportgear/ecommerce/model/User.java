package com.sportgear.ecommerce.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String username;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    private String firstName;
    private String lastName;
    
    @Enumerated(EnumType.STRING)
    private UserRole role;
    
    // Constructors, getters, setters (Lombok @Data los genera)
}

enum UserRole {
    USER, ADMIN
}