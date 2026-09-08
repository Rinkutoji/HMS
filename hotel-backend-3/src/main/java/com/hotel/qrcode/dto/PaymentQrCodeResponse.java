package com.hotel.qrcode.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PaymentQrCodeResponse {
    private Long id;
    private String bankName;
    private String imageUrl;
    private boolean active;
}
