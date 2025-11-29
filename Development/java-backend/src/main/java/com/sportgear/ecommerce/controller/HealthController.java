package com.sportgear.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class HealthController {
    
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Java Backend is healthy - SportGear Online");
    }
    
    @GetMapping("/health/detailed")
    public ResponseEntity<HealthResponse> detailedHealthCheck() {
        HealthResponse response = new HealthResponse(
            "healthy", 
            "Java Spring Boot Backend", 
            System.currentTimeMillis()
        );
        return ResponseEntity.ok(response);
    }
    
    // Clase interna para la respuesta detallada
    public static class HealthResponse {
        private String status;
        private String service;
        private long timestamp;
        
        public HealthResponse(String status, String service, long timestamp) {
            this.status = status;
            this.service = service;
            this.timestamp = timestamp;
        }
        
        // Getters
        public String getStatus() { return status; }
        public String getService() { return service; }
        public long getTimestamp() { return timestamp; }
        
        // Setters (opcionales, pero buenos para Jackson)
        public void setStatus(String status) { this.status = status; }
        public void setService(String service) { this.service = service; }
        public void setTimestamp(long timestamp) { this.timestamp = timestamp; }
    }
}
