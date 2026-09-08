package com.hotel.qrcode.service;

import com.hotel.exception.ValidationException;
import com.hotel.qrcode.entity.PaymentQrCode;
import com.hotel.qrcode.repository.PaymentQrCodeRepository;
import com.hotel.upload.UploadService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentQrCodeServiceImplTest {
    @Mock PaymentQrCodeRepository repository;
    @Mock UploadService uploadService;
    @InjectMocks PaymentQrCodeServiceImpl service;

    @Test
    void uploadTrimsBankNameAndActivatesCode() {
        when(uploadService.storeSingle(any(), eq("qr-codes"))).thenReturn("/uploads/qr-codes/q.png");
        when(repository.save(any(PaymentQrCode.class))).thenAnswer(inv -> { PaymentQrCode q = inv.getArgument(0); q.setId(1L); return q; });
        var response = service.upload("  Bank  ", new MockMultipartFile("q", "q.png", "image/png", new byte[1]));
        assertEquals("Bank", response.getBankName());
        assertTrue(response.isActive());
    }

    @Test
    void uploadRequiresBankNameAndDeleteRemovesStoredFile() {
        assertThrows(ValidationException.class, () -> service.upload(" ", null));
        PaymentQrCode code = new PaymentQrCode(); code.setId(1L); code.setImageUrl("/uploads/qr-codes/q.png");
        when(repository.findById(1L)).thenReturn(Optional.of(code));
        service.delete(1L);
        verify(uploadService).deleteFile(code.getImageUrl());
        verify(repository).delete(code);
    }
}
