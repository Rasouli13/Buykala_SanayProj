package com.buykala.backend.repository;

import com.buykala.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    // Fetch all products for a specific shop (needed for shop owner's story)
    List<Product> findByShopId(Long shopId);

    // Fetch products by category (for customer use in the frontend)
    List<Product> findByCategoryId(Long categoryId);
}