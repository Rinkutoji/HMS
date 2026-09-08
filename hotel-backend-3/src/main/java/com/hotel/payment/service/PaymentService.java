package com.hotel.payment.service;

import com.hotel.payment.dto.PaymentResponse;
import com.hotel.payment.entity.PaymentStatus;
import com.hotel.response.PageResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

public interface PaymentService {
    PaymentResponse uploadReceipt(String customerEmail, Long bookingId, MultipartFile file);
    PaymentResponse getMyPaymentStatus(String customerEmail, Long bookingId);
    PageResponse<PaymentResponse> getMyPayments(String customerEmail, Pageable pageable);

    PageResponse<PaymentResponse> search(PaymentStatus status, Pageable pageable);
    PaymentResponse getById(Long id);
    PaymentResponse verify(Long id, String adminEmail);
    PaymentResponse reject(Long id, String adminEmail);
}
