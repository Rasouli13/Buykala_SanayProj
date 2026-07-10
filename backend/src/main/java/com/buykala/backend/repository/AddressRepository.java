package com.buykala.backend.repository;

import com.buykala.backend.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AddressRepository extends JpaRepository<Address, Long> {
    // پیدا کردن تمام آدرس‌های یک کاربر خاص
    List<Address> findByUserId(Long userId);
}
