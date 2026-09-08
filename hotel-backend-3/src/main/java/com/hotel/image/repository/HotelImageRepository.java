package com.hotel.image.repository;

import com.hotel.image.entity.HotelImage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HotelImageRepository extends JpaRepository<HotelImage, Long> {
}
