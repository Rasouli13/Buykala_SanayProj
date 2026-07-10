package com.buykala.backend.dto;

import com.buykala.backend.model.enums.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "شماره موبایل نمی‌تواند خالی باشد")
    @Pattern(regexp = "^09\\d{9}$", message = "فرمت شماره موبایل معتبر نیست")
    private String phoneNumber;

    @NotBlank(message = "رمز عبور نمی‌تواند خالی باشد")
    private String password;

    @NotNull(message = "نقش کاربر باید مشخص باشد")
    private Role role;
}