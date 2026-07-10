package com.buykala.backend.repository;

import com.buykala.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // واکشی تمام محصولات یک غرفه خاص (نیازمندی یوزر استوری غرفه‌دار)
    List<Product> findByShopId(Long shopId);

    // واکشی محصولات بر اساس دسته‌بندی (برای استفاده مشتری در فرانت‌آند)
    List<Product> findByCategoryId(Long categoryId);
}