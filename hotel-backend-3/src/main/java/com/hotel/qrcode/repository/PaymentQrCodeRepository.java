package com.hotel.qrcode.repository;

import com.hotel.qrcode.entity.PaymentQrCode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentQrCodeRepository extends JpaRepository<PaymentQrCode, Long> {
    List<PaymentQrCode> findByActiveTrue();
}
