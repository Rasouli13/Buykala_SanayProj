package com.buykala.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateAddressRequest {
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Address line is required")
    private String addressLine;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "Postal code is required")
    private String postalCode;
}