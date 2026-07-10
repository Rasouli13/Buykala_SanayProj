package com.buykala.backend.repository;

import com.buykala.backend.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    
    // Fetch all items for a specific order
    List<OrderItem> findByOrderId(Long orderId);

    // Fetch order items belonging to a specific shop for the vendor panel
    List<OrderItem> findByProductShopId(Long shopId);
}