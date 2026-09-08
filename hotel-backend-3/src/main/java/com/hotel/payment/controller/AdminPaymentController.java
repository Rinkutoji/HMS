package com.hotel.payment.controller;

import com.hotel.payment.dto.PaymentResponse;
import com.hotel.payment.service.PaymentService;
import com.hotel.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/payments")
@RequiredArgsConstructor
public class AdminPaymentController {

    private final PaymentService paymentService;

    @PatchMapping("/{id}/verify")
    public ApiResponse<PaymentResponse> verify(Authentication authentication, @PathVariable Long id) {
        return ApiResponse.success("Payment verified", paymentService.verify(id, authentication.getName()));
    }

    @PatchMapping("/{id}/reject")
    public ApiResponse<PaymentResponse> reject(Authentication authentication, @PathVariable Long id) {
        return ApiResponse.success("Payment rejected", paymentService.reject(id, authentication.getName()));
    }
}
