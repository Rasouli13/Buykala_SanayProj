package com.buykala.backend.service;

import com.buykala.backend.dto.AddToCartRequest;
import com.buykala.backend.model.CartItem;
import com.buykala.backend.model.Product;
import com.buykala.backend.model.User;
import com.buykala.backend.repository.CartItemRepository;
import com.buykala.backend.repository.ProductRepository;
import com.buykala.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional
    public CartItem addToCart(AddToCartRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Check if product has enough stock
        if (product.getStock() < request.getQuantity()) {
            throw new RuntimeException("Not enough stock available");
        }

        // If item already exists in cart, update the quantity
        CartItem cartItem = cartItemRepository.findByUserIdAndProductId(userId, request.getProductId())
                .orElse(CartItem.builder().user(user).product(product).quantity(0).build());

        int newQuantity = cartItem.getQuantity() + request.getQuantity();
        
        // Re-validate stock for the accumulated quantity
        if (product.getStock() < newQuantity) {
            throw new RuntimeException("Total requested quantity exceeds available stock");
        }

        cartItem.setQuantity(newQuantity);
        return cartItemRepository.save(cartItem);
    }

    @Transactional(readOnly = true)
    public List<CartItem> getCartItems(Long userId) {
        return cartItemRepository.findByUserId(userId);
    }
}