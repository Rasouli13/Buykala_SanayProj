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

    // ثبت درخواست غرفه جدید (آی‌دی کاربر موقتاً از هدر گرفته می‌شود)
    @PostMapping
    public ResponseEntity<Shop> createShop(
            @Valid @RequestBody CreateShopRequest request,
            @RequestHeader("X-User-Id") Long userId) {

        Shop shop = shopService.createShop(request, userId);
        return new ResponseEntity<>(shop, HttpStatus.CREATED);
    }

    // تغییر وضعیت غرفه توسط ادمین
    @PatchMapping("/{shopId}/status")
    public ResponseEntity<Shop> updateShopStatus(
            @PathVariable Long shopId,
            @RequestParam ShopStatus status) {

        Shop updatedShop = shopService.updateShopStatus(shopId, status);
        return ResponseEntity.ok(updatedShop);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Shop>> getAllShops() {
        return ResponseEntity.ok(shopService.getAllShops());
    }

}