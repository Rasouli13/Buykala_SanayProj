package com.buykala.backend.controller;

import com.buykala.backend.dto.AddToCartRequest;
import com.buykala.backend.model.CartItem;
import com.buykala.backend.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    // Add item to shopping cart
    @PostMapping
    public ResponseEntity<CartItem> addToCart(
            @Valid @RequestBody AddToCartRequest request,
            @RequestHeader("X-User-Id") Long userId) {
        CartItem cartItem = cartService.addToCart(request, userId);
        return new ResponseEntity<>(cartItem, HttpStatus.CREATED);
    }

    // Get current user's cart items
    @SuppressWarnings("unused")
    @GetMapping
    public ResponseEntity<List<CartItem>> getCartItems(@RequestHeader("X-User-Id") Long userId) {
        return ResponseEntity.ok(cartService.getCartItems(userId));
    }
}