package com.sportgear.ecommerce.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilTest {

    private JwtUtil jwtUtil;
    private final String SECRET_KEY = "testSecretKeyForJWTThatIsVeryLongAndSecureForHS256AlgorithmTesting";
    private final String TEST_EMAIL = "test@example.com";

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
        ReflectionTestUtils.setField(jwtUtil, "secret", SECRET_KEY);
        ReflectionTestUtils.setField(jwtUtil, "expiration", 86400000L); // 1 day
    }

    @Test
    void testGenerateToken_Success() {
        // Act
        String token = jwtUtil.generateToken(TEST_EMAIL);

        // Assert
        assertNotNull(token);
        assertFalse(token.isEmpty());
        assertTrue(token.split("\\.").length == 3); // JWT has 3 parts
    }

    @Test
    void testExtractUsername_Success() {
        // Arrange
        String token = jwtUtil.generateToken(TEST_EMAIL);

        // Act
        String extractedEmail = jwtUtil.extractUsername(token);

        // Assert
        assertEquals(TEST_EMAIL, extractedEmail);
    }

    @Test
    void testValidateToken_ValidToken() {
        // Arrange
        String token = jwtUtil.generateToken(TEST_EMAIL);

        // Act
        boolean isValid = jwtUtil.validateToken(token);

        // Assert
        assertTrue(isValid);
    }

    @Test
    void testValidateToken_InvalidToken() {
        // Arrange
        String invalidToken = "invalid.token.here";

        // Act
        boolean isValid = jwtUtil.validateToken(invalidToken);

        // Assert
        assertFalse(isValid);
    }

    @Test
    void testGenerateAndValidateToken_RoundTrip() {
        // Arrange
        String token = jwtUtil.generateToken(TEST_EMAIL);

        // Act
        String extractedEmail = jwtUtil.extractUsername(token);
        boolean isValid = jwtUtil.validateToken(token);

        // Assert
        assertEquals(TEST_EMAIL, extractedEmail);
        assertTrue(isValid);
    }
}
