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

        // 1. Find the requesting user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("کاربر یافت نشد"));

        // 2. Check if the user already has a shop
        if (shopRepository.findByUserId(userId).isPresent()) {
            throw new RuntimeException("این کاربر در حال حاضر یک غرفه دارد");
        }

        // 3. Create a new shop (default status is set to PENDING in PrePersist)
        Shop shop = Shop.builder()
                .name(request.getName())
                .shabaNumber(request.getShabaNumber())
                .user(user)
                .build();

        return shopRepository.save(shop);
    }

    @Transactional
    public Shop updateShopStatus(Long shopId, ShopStatus newStatus) {

        // admin can approve or reject a shop by changing its status
        Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new RuntimeException("غرفه یافت نشد"));

        shop.setStatus(newStatus);
        return shopRepository.save(shop);
    }

    public List<Shop> getAllShops() {
        return shopRepository.findAll();
    }
}