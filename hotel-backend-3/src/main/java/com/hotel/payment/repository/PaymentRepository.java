package com.hotel.payment.repository;

import com.hotel.payment.entity.Payment;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long>, JpaSpecificationExecutor<Payment> {
    Optional<Payment> findByBookingId(Long bookingId);

    @Query("SELECT p FROM Payment p WHERE p.booking.user.id = :userId ORDER BY p.createdAt DESC")
    List<Payment> findRecentByUser(@Param("userId") Long userId, Pageable pageable);
}
