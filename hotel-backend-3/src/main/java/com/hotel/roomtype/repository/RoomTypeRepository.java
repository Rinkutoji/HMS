package com.hotel.roomtype.repository;

import com.hotel.roomtype.entity.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomTypeRepository extends JpaRepository<RoomType, Long> {
    boolean existsByNameIgnoreCase(String name);
}
