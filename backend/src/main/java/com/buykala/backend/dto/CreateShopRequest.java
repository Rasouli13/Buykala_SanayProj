package com.buykala.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateShopRequest {

    @NotBlank(message = "نام غرفه نمی‌تواند خالی باشد")
    private String name;

    @NotBlank(message = "شماره شبا نمی‌تواند خالی باشد")
    @Size(min = 26, max = 26, message = "شماره شبا باید ۲۶ رقم باشد (همراه با IR)")
    private String shabaNumber;
}