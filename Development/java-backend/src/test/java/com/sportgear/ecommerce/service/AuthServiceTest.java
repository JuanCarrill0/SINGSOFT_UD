package com.sportgear.ecommerce.service;

import com.sportgear.ecommerce.model.User;
import com.sportgear.ecommerce.repository.UserRepository;
import com.sportgear.ecommerce.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthService authService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setUserID(UUID.randomUUID());
        testUser.setEmail("test@example.com");
        testUser.setFirstName("John");
        testUser.setLastName("Doe");
        testUser.setPasswordHash("$2a$10$encodedPassword");
        testUser.setPhoneNumber("1234567890");
    }

    @Test
    void testRegister_Success() {
        // Arrange
        User newUser = new User();
        newUser.setEmail("new@example.com");
        newUser.setPasswordHash("password123");
        newUser.setFirstName("Jane");
        
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(anyString())).thenReturn("$2a$10$encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(newUser);
        when(jwtUtil.generateToken(anyString())).thenReturn("jwt.token.here");

        // Act
        String token = authService.register(newUser);

        // Assert
        assertNotNull(token);
        assertEquals("jwt.token.here", token);
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testRegister_EmailAlreadyExists() {
        // Arrange
        User newUser = new User();
        newUser.setEmail("existing@example.com");
        newUser.setPasswordHash("password123");
        
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));

        // Act & Assert
        assertThrows(RuntimeException.class, () -> authService.register(newUser));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testLogin_Success() {
        // Arrange
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);
        when(jwtUtil.generateToken(anyString())).thenReturn("jwt.token.here");

        // Act
        Map<String, Object> result = authService.login("test@example.com", "password123");

        // Assert
        assertNotNull(result);
        assertTrue(result.containsKey("token"));
        assertTrue(result.containsKey("user"));
        assertEquals("jwt.token.here", result.get("token"));
    }

    @Test
    void testLogin_InvalidPassword() {
        // Arrange
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(false);

        // Act & Assert
        assertThrows(RuntimeException.class, 
            () -> authService.login("test@example.com", "wrongpassword"));
    }

    @Test
    void testLogin_UserNotFound() {
        // Arrange
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, 
            () -> authService.login("nonexistent@example.com", "password"));
    }

    @Test
    void testGetUserById_Success() {
        // Arrange
        UUID userId = UUID.randomUUID();
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));

        // Act
        Optional<User> result = authService.getUserById(userId);

        // Assert
        assertTrue(result.isPresent());
        assertEquals("test@example.com", result.get().getEmail());
    }

    @Test
    void testGetUserById_NotFound() {
        // Arrange
        UUID userId = UUID.randomUUID();
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // Act
        Optional<User> result = authService.getUserById(userId);

        // Assert
        assertFalse(result.isPresent());
    }
}
