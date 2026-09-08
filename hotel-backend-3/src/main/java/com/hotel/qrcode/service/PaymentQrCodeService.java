package com.hotel.qrcode.service;

import com.hotel.qrcode.dto.PaymentQrCodeResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface PaymentQrCodeService {
    PaymentQrCodeResponse upload(String bankName, MultipartFile file);
    List<PaymentQrCodeResponse> listAll();
    List<PaymentQrCodeResponse> listActive();
    PaymentQrCodeResponse setActive(Long id, boolean active);
    void delete(Long id);
}
