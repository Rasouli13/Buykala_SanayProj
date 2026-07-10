package com.buykala.backend.controller;

import com.buykala.backend.dto.CreateShopRequest;
import com.buykala.backend.model.Shop;
import com.buykala.backend.model.enums.ShopStatus;
import com.buykala.backend.service.ShopService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/shops")
@RequiredArgsConstructor
public class ShopController {

    private final ShopService shopService;

    
    // Create a new shop request (user ID is temporarily taken from the header)
    @PostMapping
    public ResponseEntity<Shop> createShop(
            @Valid @RequestBody CreateShopRequest request,
            @RequestHeader("X-User-Id") Long userId) {

        Shop shop = shopService.createShop(request, userId);
        return new ResponseEntity<>(shop, HttpStatus.CREATED);
    }

    
    // Update shop status by admin
    @PatchMapping("/{shopId}/status")
    public ResponseEntity<Shop> updateShopStatus(
            @PathVariable Long shopId,
            @RequestParam ShopStatus status) {

        Shop updatedShop = shopService.updateShopStatus(shopId, status);
        return ResponseEntity.ok(updatedShop);
    }

    @GetMapping
    public ResponseEntity<List<Shop>> getAllShops() {
        return ResponseEntity.ok(shopService.getAllShops());
    }

}