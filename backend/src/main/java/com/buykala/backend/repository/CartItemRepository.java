package com.buykala.backend.repository;

import com.buykala.backend.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    
    // Find all cart items for a specific user
    List<CartItem> findByUserId(Long userId);

    // Check if the product already exists in the user's cart
    Optional<CartItem> findByUserIdAndProductId(Long userId, Long productId);

    // Clear the user's cart after finalizing the order
    void deleteByUserId(Long userId);
}