package com.hotel.payment.dto;

import com.hotel.payment.entity.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class PaymentResponse {
    private Long id;
    private Long bookingId;
    private String receiptImageUrl;
    private BigDecimal amount;
    private PaymentStatus status;
    private String verifiedByName;
    private LocalDateTime verifiedAt;
    private LocalDateTime createdAt;
}
