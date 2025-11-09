package com.sportgear.ecommerce.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class RegisterRequest {
    private String email;
    private String password;  // ⬅️ Frontend sends "password", no "passwordHash"
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private LocalDate dateOfBirth;
}