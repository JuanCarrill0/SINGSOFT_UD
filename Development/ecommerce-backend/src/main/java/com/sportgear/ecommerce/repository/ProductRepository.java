package com.sportgear.ecommerce.repository;

import com.sportgear.ecommerce.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategory(String category);
    List<Product> findBySportType(String sportType);
    List<Product> findByNameContainingIgnoreCase(String name);
}