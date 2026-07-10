package com.buykala.backend.repository;

import com.buykala.backend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    
    // Fetch order history for a specific customer
    List<Order> findByUserId(Long userId);
}