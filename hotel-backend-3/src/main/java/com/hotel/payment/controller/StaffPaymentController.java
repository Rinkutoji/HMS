package com.hotel.payment.controller;

import com.hotel.payment.dto.PaymentResponse;
import com.hotel.payment.entity.PaymentStatus;
import com.hotel.payment.service.PaymentService;
import com.hotel.response.ApiResponse;
import com.hotel.response.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/staff/payments")
@RequiredArgsConstructor
public class StaffPaymentController {

    private final PaymentService paymentService;

    @GetMapping
    public ApiResponse<PageResponse<PaymentResponse>> search(
            @RequestParam(required = false) PaymentStatus status,
            @PageableDefault(size = 10, sort = "createdAt") Pageable pageable) {
        return ApiResponse.success(paymentService.search(status, pageable));
    }

    @GetMapping("/{id}")
    public ApiResponse<PaymentResponse> getById(@PathVariable Long id) {
        return ApiResponse.success(paymentService.getById(id));
    }
}
