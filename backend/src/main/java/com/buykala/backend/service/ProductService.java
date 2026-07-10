package com.buykala.backend.service;

import com.buykala.backend.dto.CreateProductRequest;
import com.buykala.backend.model.Category;
import com.buykala.backend.model.Product;
import com.buykala.backend.model.Shop;
import com.buykala.backend.model.enums.ShopStatus;
import com.buykala.backend.repository.CategoryRepository;
import com.buykala.backend.repository.ProductRepository;
import com.buykala.backend.repository.ShopRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ShopRepository shopRepository;
    private final CategoryRepository categoryRepository;

    @Transactional
    public Product createProduct(CreateProductRequest request, Long userId) {
        // ۱. واکشی غرفه کاربر و بررسی وضعیت تایید آن
        Shop shop = shopRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("غرفه‌ای برای این کاربر یافت نشد"));

        if (shop.getStatus() != ShopStatus.APPROVED) {
            throw new RuntimeException("غرفه شما هنوز توسط ادمین تایید نشده است و امکان ثبت محصول ندارید");
        }

        // ۲. واکشی دسته‌بندی
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("دسته‌بندی مورد نظر یافت نشد"));

        // ۳. ساخت و ذخیره محصول
        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .stock(request.getStock())
                .category(category)
                .shop(shop)
                .build();

        return productRepository.save(product);
    }

    @Transactional(readOnly = true)
    public List<Product> getProductsByShop(Long shopId) {
        return productRepository.findByShopId(shopId);
    }

    @Transactional(readOnly = true)
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
}