package com.buykala.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateCategoryRequest {
    @NotBlank(message = "نام دسته‌بندی نمی‌تواند خالی باشد")
    private String name;
}