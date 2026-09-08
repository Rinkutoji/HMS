package com.hotel.qrcode.controller;

import com.hotel.qrcode.dto.PaymentQrCodeResponse;
import com.hotel.qrcode.service.PaymentQrCodeService;
import com.hotel.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Public read-only endpoint so customers can see active payment QR codes
 * (e.g. on the booking payment step) without needing extra permissions.
 */
@RestController
@RequestMapping("/api/public/payment-qr-codes")
@RequiredArgsConstructor
public class PaymentQrCodeController {

    private final PaymentQrCodeService paymentQrCodeService;

    @GetMapping
    public ApiResponse<List<PaymentQrCodeResponse>> listActive() {
        return ApiResponse.success(paymentQrCodeService.listActive());
    }
}
