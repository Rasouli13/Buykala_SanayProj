package com.buykala.backend.service;

import com.buykala.backend.dto.RegisterRequest;
import com.buykala.backend.model.User;
import com.buykala.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional
    public User register(RegisterRequest request) {
        Optional<User> existingUser = userRepository.findByPhoneNumber(request.getPhoneNumber());

        // If user already exists, act as a Login mechanism
        if (existingUser.isPresent()) {
            User user = existingUser.get();
            if (user.getPassword().equals(request.getPassword())) {
                return user; // Successful Login
            } else {
                throw new RuntimeException("رمز عبور وارد شده اشتباه است");
            }
        }

        // If user is new, build and register
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