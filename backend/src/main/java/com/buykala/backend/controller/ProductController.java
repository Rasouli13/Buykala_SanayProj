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

    // ایجاد محصول توسط غرفه‌دار (تایید وضعیت غرفه درون سرویس چک می‌شود)
    @PostMapping
    public ResponseEntity<Product> createProduct(
            @Valid @RequestBody CreateProductRequest request,
            @RequestHeader("X-User-Id") Long userId) {
        
        Product product = productService.createProduct(request, userId);
        return new ResponseEntity<>(product, HttpStatus.CREATED);
    }

    // دریافت تمام محصولات سایت (برای صفحه اصلی فروشگاه)
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    // دریافت محصولات یک غرفه خاص
    @GetMapping("/shop/{shopId}")
    public ResponseEntity<List<Product>> getProductsByShop(@PathVariable Long shopId) {
        return ResponseEntity.ok(productService.getProductsByShop(shopId));
    }
}