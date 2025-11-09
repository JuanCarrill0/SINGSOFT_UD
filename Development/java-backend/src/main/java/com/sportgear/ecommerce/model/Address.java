package com.sportgear.ecommerce.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.util.UUID;

@Entity
@Table(name = "addresses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Address {

    @Id
    @GeneratedValue
    private UUID id;

    private String streetType;
    private String mainNumber;
    private String numberPrefix;
    private String secondaryNumber;
    private String additionalInfo;
    
    private String neighborhood;
    private String city;
    
    private String zipCode;
    private String country;

    /**
     * Many addresses -> one user
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    /* ---------- Business Methods ---------- */

    /**
     * Formats the complete address for shipping purposes
     */
    public String formatForShipping() {
        StringBuilder sb = new StringBuilder();
        
        if (streetType != null) {
            sb.append(streetType).append(" ");
        }
        
        sb.append(getFullStreet());
        
        if (neighborhood != null && !neighborhood.isBlank()) {
            sb.append(", ").append(neighborhood);
        }
        if (city != null && !city.isBlank()) {
            sb.append(", ").append(city);
        }
        if (zipCode != null && !zipCode.isBlank()) {
            sb.append(" ").append(zipCode);
        }
        if (country != null && !country.isBlank()) {
            sb.append(", ").append(country);
        }
        
        return sb.toString().trim();
    }

    /**
     * Validates if the address has required fields
     */
    public boolean validateAddress() {
        return mainNumber != null && !mainNumber.isBlank() &&
               city != null && !city.isBlank() &&
               zipCode != null && !zipCode.isBlank() &&
               country != null && !country.isBlank();
    }

    /**
     * Gets the full street address without city/country
     */
    public String getFullStreet() {
        StringBuilder sb = new StringBuilder();
        
        // just include principal and secondary number
        if (mainNumber != null && !mainNumber.isBlank()) {
            if (numberPrefix != null && !numberPrefix.isBlank()) {
                sb.append(numberPrefix).append(" ");
            }
            sb.append(mainNumber);
            if (secondaryNumber != null && !secondaryNumber.isBlank()) {
                sb.append("-").append(secondaryNumber);
            }
        }
        
        // add aditional information if exist
        if (additionalInfo != null && !additionalInfo.isBlank()) {
            if (sb.length() > 0) {
                sb.append(" - ");
            }
            sb.append(additionalInfo);
        }
        
        return sb.toString().trim();
    }

    /**
     * Checks if all critical fields are present
     */
    public boolean isComplete() {
        return validateAddress(); // Same logic as validateAddress
    }
}