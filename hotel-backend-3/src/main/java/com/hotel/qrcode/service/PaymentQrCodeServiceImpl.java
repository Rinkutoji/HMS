package com.hotel.qrcode.service;

import com.hotel.exception.ResourceNotFoundException;
import com.hotel.exception.ValidationException;
import com.hotel.qrcode.dto.PaymentQrCodeResponse;
import com.hotel.qrcode.entity.PaymentQrCode;
import com.hotel.qrcode.repository.PaymentQrCodeRepository;
import com.hotel.upload.UploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentQrCodeServiceImpl implements PaymentQrCodeService {

    private static final String UPLOAD_SUB_DIR = "qr-codes";

    private final PaymentQrCodeRepository paymentQrCodeRepository;
    private final UploadService uploadService;

    @Override
    @Transactional
    public PaymentQrCodeResponse upload(String bankName, MultipartFile file) {
        if (bankName == null || bankName.isBlank()) {
            throw new ValidationException("Bank name is required");
        }

        String url = uploadService.storeSingle(file, UPLOAD_SUB_DIR);

        PaymentQrCode qrCode = new PaymentQrCode();
        qrCode.setBankName(bankName.trim());
        qrCode.setImageUrl(url);
        qrCode.setActive(true);

        return toResponse(paymentQrCodeRepository.save(qrCode));
    }

    @Override
    public List<PaymentQrCodeResponse> listAll() {
        return paymentQrCodeRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<PaymentQrCodeResponse> listActive() {
        return paymentQrCodeRepository.findByActiveTrue().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public PaymentQrCodeResponse setActive(Long id, boolean active) {
        PaymentQrCode qrCode = findById(id);
        qrCode.setActive(active);
        return toResponse(paymentQrCodeRepository.save(qrCode));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        PaymentQrCode qrCode = findById(id);
        uploadService.deleteFile(qrCode.getImageUrl());
        paymentQrCodeRepository.delete(qrCode);
    }

    private PaymentQrCode findById(Long id) {
        return paymentQrCodeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment QR code not found with id: " + id));
    }

    private PaymentQrCodeResponse toResponse(PaymentQrCode qrCode) {
        return new PaymentQrCodeResponse(
                qrCode.getId(),
                qrCode.getBankName(),
                qrCode.getImageUrl(),
                qrCode.isActive()
        );
    }
}
