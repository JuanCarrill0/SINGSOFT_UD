package test.java.com.sportgear.ecommerce.controller;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sportgear.ecommerce.model.User;
import com.sportgear.ecommerce.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    private User testUser;
    private Map<String, String> registerRequest;
    private Map<String, String> loginRequest;
    private UUID testUserId;

    @BeforeEach
    void setUp() {
        testUserId = UUID.randomUUID();
        testUser = new User();
        testUser.setUserID(testUserId);
        testUser.setEmail("test@example.com");
        testUser.setFirstName("John");
        testUser.setLastName("Doe");
        testUser.setPhoneNumber("1234567890");

        registerRequest = new HashMap<>();
        registerRequest.put("email", "test@example.com");
        registerRequest.put("password", "password123");
        registerRequest.put("firstName", "John");
        registerRequest.put("lastName", "Doe");
        registerRequest.put("phoneNumber", "1234567890");

        loginRequest = new HashMap<>();
        loginRequest.put("email", "test@example.com");
        loginRequest.put("password", "password123");
    }

    @Test
    void testRegister_Success() throws Exception {
        // Arrange
        when(authService.register(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setUserID(testUserId); // Set ID when registered
            return "jwt.token.here";
        });

        // Act & Assert
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("User registered successfully"))
                .andExpect(jsonPath("$.token").value("jwt.token.here"))
                .andExpect(jsonPath("$.user.email").value("test@example.com"));
    }

    @Test
    void testLogin_Success() throws Exception {
        // Arrange
        Map<String, Object> loginResponse = new HashMap<>();
        loginResponse.put("token", "jwt.token.here");
        Map<String, Object> userData = new HashMap<>();
        userData.put("userid", testUserId.toString());
        userData.put("email", "test@example.com");
        loginResponse.put("user", userData);
        
        when(authService.login(anyString(), anyString())).thenReturn(loginResponse);

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("jwt.token.here"));
    }

    @Test
    void testLogin_InvalidCredentials() throws Exception {
        // Arrange
        when(authService.login(anyString(), anyString()))
                .thenThrow(new RuntimeException("Invalid credentials"));

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser
    void testGetUserById_Success() throws Exception {
        // Arrange
        when(authService.getUserById(testUserId)).thenReturn(Optional.of(testUser));

        // Act & Assert
        mockMvc.perform(get("/api/auth/users/{userId}", testUserId.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("test@example.com"))
                .andExpect(jsonPath("$.firstName").value("John"));
    }

    @Test
    @WithMockUser
    void testGetUserById_NotFound() throws Exception {
        // Arrange
        UUID randomId = UUID.randomUUID();
        when(authService.getUserById(randomId)).thenReturn(Optional.empty());

        // Act & Assert
        mockMvc.perform(get("/api/auth/users/{userId}", randomId.toString()))
                .andExpect(status().isNotFound());
    }
}
