package com.hotel.review.repository;

import com.hotel.review.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    Optional<Review> findByBookingId(Long bookingId);

    @Query("SELECT r FROM Review r WHERE r.booking.room.id = :roomId ORDER BY r.createdAt DESC")
    Page<Review> findByRoomId(@Param("roomId") Long roomId, Pageable pageable);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.booking.room.id = :roomId")
    Double findAverageRatingByRoomId(@Param("roomId") Long roomId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.booking.room.id = :roomId")
    long countByRoomId(@Param("roomId") Long roomId);
}