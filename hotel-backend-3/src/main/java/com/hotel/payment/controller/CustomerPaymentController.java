package com.hotel.payment.controller;

import com.hotel.payment.dto.PaymentResponse;
import com.hotel.payment.service.PaymentService;
import com.hotel.response.ApiResponse;
import com.hotel.response.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/customer/payments")
@RequiredArgsConstructor
public class CustomerPaymentController {

    private final PaymentService paymentService;

    @GetMapping
    public ApiResponse<PageResponse<PaymentResponse>> getMyPayments(
            Authentication authentication,
            @PageableDefault(size = 10, sort = "createdAt") Pageable pageable) {
        return ApiResponse.success(paymentService.getMyPayments(authentication.getName(), pageable));
    }

    @PostMapping("/{bookingId}/receipt")
    public ApiResponse<PaymentResponse> uploadReceipt(Authentication authentication,
                                                        @PathVariable Long bookingId,
                                                        @RequestParam("file") MultipartFile file) {
        return ApiResponse.success("Receipt uploaded",
                paymentService.uploadReceipt(authentication.getName(), bookingId, file));
    }

    @GetMapping("/{bookingId}")
    public ApiResponse<PaymentResponse> getStatus(Authentication authentication, @PathVariable Long bookingId) {
        return ApiResponse.success(paymentService.getMyPaymentStatus(authentication.getName(), bookingId));
    }
}
