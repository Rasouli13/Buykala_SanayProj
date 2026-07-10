package com.buykala.backend.controller;

import com.buykala.backend.dto.CreateAddressRequest;
import com.buykala.backend.model.Address;
import com.buykala.backend.service.AddressService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    @PostMapping
    public ResponseEntity<Address> createAddress(
            @Valid @RequestBody CreateAddressRequest request,
            @RequestHeader("X-User-Id") Long userId) {
        Address address = addressService.createAddress(request, userId);
        return new ResponseEntity<>(address, HttpStatus.CREATED);
    }
}