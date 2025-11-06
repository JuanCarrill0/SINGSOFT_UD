package com.sportgear.ecommerce.repository;

import com.sportgear.ecommerce.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;
import java.util.List;

public interface AddressRepository extends JpaRepository<Address, UUID> {
    List<Address> findByUser_UserID(UUID userId);
}
