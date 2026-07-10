package com.buykala.backend.controller;

import com.buykala.backend.dto.CreateProductRequest;
import com.buykala.backend.model.Product;
import com.buykala.backend.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    // Create a new product by the shop owner (shop status is checked within the service)
    @PostMapping
    public ResponseEntity<Product> createProduct(
            @Valid @RequestBody CreateProductRequest request,
            @RequestHeader("X-User-Id") Long userId) {
        
        Product product = productService.createProduct(request, userId);
        return new ResponseEntity<>(product, HttpStatus.CREATED);
    }

    //get all products for the main shop page
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    //products for a specific shop (for shop owner's story)
    @GetMapping("/shop/{shopId}")
    public ResponseEntity<List<Product>> getProductsByShop(@PathVariable Long shopId) {
        return ResponseEntity.ok(productService.getProductsByShop(shopId));
    }
}