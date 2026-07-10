package com.buykala.backend.service;

import com.buykala.backend.dto.RegisterRequest;
import com.buykala.backend.model.User;
import com.buykala.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional
    public User register(RegisterRequest request) {
        
        // Check if the phone number is already registered
        if (userRepository.findByPhoneNumber(request.getPhoneNumber()).isPresent()) {
            throw new RuntimeException("این شماره موبایل قبلاً در سیستم ثبت شده است");
        }

        //2. Create and save the new user
        User user = User.builder()
                .phoneNumber(request.getPhoneNumber())
                .password(request.getPassword())
                .role(request.getRole())
                .build();

        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}