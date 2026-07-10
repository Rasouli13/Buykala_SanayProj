package com.buykala.backend.service;

import com.buykala.backend.dto.CreateCategoryRequest;
import com.buykala.backend.model.Category;
import com.buykala.backend.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Transactional
    public Category createCategory(CreateCategoryRequest request) {
        if (categoryRepository.findByName(request.getName()).isPresent()) {
            throw new RuntimeException("این دسته‌بندی قبلاً ایجاد شده است");
        }
        Category category = Category.builder()
                .name(request.getName())
                .build();
        return categoryRepository.save(category);
    }

    @Transactional(readOnly = true)
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }
}