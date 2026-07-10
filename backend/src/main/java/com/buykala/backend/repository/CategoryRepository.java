package com.buykala.backend.repository;

import com.buykala.backend.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    // برای بررسی تکراری نبودن نام دسته‌بندی هنگام ساخت توسط ادمین
    Optional<Category> findByName(String name);
}