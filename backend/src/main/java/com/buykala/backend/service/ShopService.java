package com.buykala.backend.service;

import com.buykala.backend.dto.CreateShopRequest;
import com.buykala.backend.model.Shop;
import com.buykala.backend.model.User;
import com.buykala.backend.model.enums.ShopStatus;
import com.buykala.backend.repository.ShopRepository;
import com.buykala.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ShopService {

    private final ShopRepository shopRepository;
    private final UserRepository userRepository;

    @Transactional
    public Shop createShop(CreateShopRequest request, Long userId) {
        // ۱. پیدا کردن کاربر درخواست‌دهنده
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("کاربر یافت نشد"));

        // ۲. بررسی اینکه کاربر از قبل غرفه نداشته باشد
        if (shopRepository.findByUserId(userId).isPresent()) {
            throw new RuntimeException("این کاربر در حال حاضر یک غرفه دارد");
        }

        // ۳. ساخت غرفه جدید (وضعیت پیش‌فرض در PrePersist روی PENDING ست می‌شود)
        Shop shop = Shop.builder()
                .name(request.getName())
                .shabaNumber(request.getShabaNumber())
                .user(user)
                .build();

        return shopRepository.save(shop);
    }

    @Transactional
    public Shop updateShopStatus(Long shopId, ShopStatus newStatus) {
        // متد مدیریت ادمین برای تایید یا رد غرفه
        Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new RuntimeException("غرفه یافت نشد"));

        shop.setStatus(newStatus);
        return shopRepository.save(shop);
    }

    public List<Shop> getAllShops() {
        return shopRepository.findAll();
    }
}