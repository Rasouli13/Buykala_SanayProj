package com.buykala.backend.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

@lombok.Data
public class CreateProductRequest {

    @NotBlank(message = "نام محصول نمی‌تواند خالی باشد")
    private String name;

    private String description;

    @NotNull(message = "قیمت محصول نمی‌تواند خالی باشد")
    @DecimalMin(value = "0.0", inclusive = false, message = "قیمت محصول باید بیشتر از صفر باشد")
    private BigDecimal price;

    @NotNull(message = "موجودی انبار نمی‌تواند خالی باشد")
    @Min(value = 0, message = "موجودی انبار نمی‌تواند منفی باشد")
    private Integer stock;

    @NotNull(message = "شناسه دسته‌بندی الزامی است")
    private Long categoryId;
}