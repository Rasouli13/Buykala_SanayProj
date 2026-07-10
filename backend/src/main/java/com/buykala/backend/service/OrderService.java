package com.buykala.backend.service;

import com.buykala.backend.dto.CheckoutRequest;
import com.buykala.backend.model.*;
import com.buykala.backend.model.enums.OrderStatus;
import com.buykala.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    @Transactional
    public Order checkout(CheckoutRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Address address = addressRepository.findById(request.getAddressId())
                .orElseThrow(() -> new RuntimeException("Address not found"));

        // Fetch user's cart items
        List<CartItem> cartItems = cartItemRepository.findByUserId(userId);
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // Calculate total price and validate stock
        BigDecimal totalPrice = BigDecimal.ZERO;
        for (CartItem item : cartItems) {
            Product product = item.getProduct();
            if (product.getStock() < item.getQuantity()) {
                throw new RuntimeException("Product " + product.getName() + " is out of stock");
            }

            BigDecimal itemCost = product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            totalPrice = totalPrice.add(itemCost);
        }

        // Create and save the main order
        Order order = Order.builder()
                .user(user)
                .address(address)
                .totalPrice(totalPrice)
                .status(OrderStatus.PAID) // Simulated instant successful payment
                .build();
        Order savedOrder = orderRepository.save(order);

        // Process each item: create OrderItem and decrease product stock
        for (CartItem item : cartItems) {
            Product product = item.getProduct();

            // Decrease stock
            product.setStock(product.getStock() - item.getQuantity());
            productRepository.save(product);

            // Create OrderItem (capturing current price)
            OrderItem orderItem = OrderItem.builder()
                    .order(savedOrder)
                    .product(product)
                    .quantity(item.getQuantity())
                    .price(product.getPrice())
                    .build();
            orderItemRepository.save(orderItem);
        }

        // Clear the user's shopping cart
        cartItemRepository.deleteByUserId(userId);

        return savedOrder;
    }

    @Transactional
    public Order updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        return orderRepository.save(order);
    }
}