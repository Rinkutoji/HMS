package com.hotel.qrcode.controller;

import com.hotel.qrcode.dto.PaymentQrCodeResponse;
import com.hotel.qrcode.service.PaymentQrCodeService;
import com.hotel.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * QR code management for Staff AND Admin (both roles can upload/manage
 * payment QR codes, per hasAnyRole("STAFF", "ADMIN") on /api/staff/** in
 * SecurityConfig).
 */
@RestController
@RequestMapping("/api/staff/qr-codes")
@RequiredArgsConstructor
public class StaffPaymentQrCodeController {

    private final PaymentQrCodeService paymentQrCodeService;

    @PostMapping
    public ResponseEntity<ApiResponse<PaymentQrCodeResponse>> upload(
            @RequestParam("bankName") String bankName,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("QR code uploaded", paymentQrCodeService.upload(bankName, file)));
    }

    @GetMapping
    public ApiResponse<List<PaymentQrCodeResponse>> listAll() {
        return ApiResponse.success(paymentQrCodeService.listAll());
    }

    @PatchMapping("/{id}/activate")
    public ApiResponse<PaymentQrCodeResponse> activate(@PathVariable Long id) {
        return ApiResponse.success("QR code activated", paymentQrCodeService.setActive(id, true));
    }

    @PatchMapping("/{id}/deactivate")
    public ApiResponse<PaymentQrCodeResponse> deactivate(@PathVariable Long id) {
        return ApiResponse.success("QR code deactivated", paymentQrCodeService.setActive(id, false));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        paymentQrCodeService.delete(id);
        return ApiResponse.success("QR code deleted", null);
    }
}
