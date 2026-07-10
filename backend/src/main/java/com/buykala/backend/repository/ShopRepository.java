package com.buykala.backend.repository;

import com.buykala.backend.model.Shop;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShopRepository extends JpaRepository<Shop, Long> {
    Optional<Shop> findByUserId(long userId);
}
