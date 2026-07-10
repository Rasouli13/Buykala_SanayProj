package com.buykala.backend.repository;

import com.buykala.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;


public interface UserRepository extends JpaRepository<User, Long> {
    //  SELECT * FROM users WHERE phone_number = ?
    Optional<User> findByPhoneNumber(String phoneNumber);
    
}