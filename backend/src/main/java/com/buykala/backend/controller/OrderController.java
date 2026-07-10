package com.buykala.backend.controller;

import com.buykala.backend.dto.CheckoutRequest;
import com.buykala.backend.model.Order;
import com.buykala.backend.model.enums.OrderStatus;
import com.buykala.backend.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // Finalize cart and create order (Simulated checkout)
    @PostMapping("/checkout")
    public ResponseEntity<Order> checkout(
            @Valid @RequestBody CheckoutRequest request,
            @RequestHeader("X-User-Id") Long userId) {
        Order order = orderService.checkout(request, userId);
        return new ResponseEntity<>(order, HttpStatus.CREATED);
    }

    // Update order status (e.g., VENDOR sets it to SHIPPED)
    @PatchMapping("/{orderId}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam OrderStatus status) {
        Order updatedOrder = orderService.updateOrderStatus(orderId, status);
        return ResponseEntity.ok(updatedOrder);
    }
}