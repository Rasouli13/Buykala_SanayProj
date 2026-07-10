package com.buykala.backend.service;

import com.buykala.backend.dto.CreateAddressRequest;
import com.buykala.backend.model.Address;
import com.buykala.backend.model.User;
import com.buykala.backend.repository.AddressRepository;
import com.buykala.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    @Transactional
    public Address createAddress(CreateAddressRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Address address = Address.builder()
                .title(request.getTitle())
                .addressLine(request.getAddressLine())
                .city(request.getCity())
                .postalCode(request.getPostalCode())
                .user(user)
                .build();

        return addressRepository.save(address);
    }
}