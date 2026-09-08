package com.hotel.payment.service;

import com.hotel.booking.entity.Booking;
import com.hotel.booking.entity.BookingStatus;
import com.hotel.booking.repository.BookingRepository;
import com.hotel.booking.service.BookingService;
import com.hotel.exception.UnauthorizedException;
import com.hotel.exception.ValidationException;
import com.hotel.payment.entity.Payment;
import com.hotel.payment.entity.PaymentStatus;
import com.hotel.payment.repository.PaymentRepository;
import com.hotel.upload.UploadService;
import com.hotel.user.entity.User;
import com.hotel.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentServiceImplTest {
    @Mock PaymentRepository paymentRepository;
    @Mock BookingRepository bookingRepository;
    @Mock BookingService bookingService;
    @Mock UserRepository userRepository;
    @Mock UploadService uploadService;
    @InjectMocks PaymentServiceImpl service;

    @Test
    void uploadReceiptCreatesPendingPaymentForOwnedPendingBooking() {
        User customer = user(1L, "c@example.com");
        Booking booking = booking(7L, customer, BookingStatus.PENDING);
        when(userRepository.findByEmail(customer.getEmail())).thenReturn(Optional.of(customer));
        when(bookingRepository.findById(7L)).thenReturn(Optional.of(booking));
        when(paymentRepository.findByBookingId(7L)).thenReturn(Optional.empty());
        when(uploadService.storeSingle(any(), eq("payments"))).thenReturn("/uploads/payments/r.jpg");
        when(paymentRepository.save(any(Payment.class))).thenAnswer(inv -> inv.getArgument(0));

        var result = service.uploadReceipt(customer.getEmail(), 7L,
                new MockMultipartFile("receipt", "r.jpg", "image/jpeg", new byte[]{1}));

        assertEquals(PaymentStatus.PENDING, result.getStatus());
        assertEquals(new BigDecimal("100.00"), result.getAmount());
        verify(paymentRepository).save(argThat(p -> p.getBooking() == booking && p.getReceiptImageUrl().endsWith("r.jpg")));
    }

    @Test
    void uploadReceiptAllowsReplacingRejectedPaymentAndDeletesOldFile() {
        User customer = user(1L, "c@example.com");
        Booking booking = booking(7L, customer, BookingStatus.PENDING);
        Payment payment = payment(8L, booking, PaymentStatus.REJECTED);
        payment.setReceiptImageUrl("/uploads/payments/old.jpg");
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(customer));
        when(bookingRepository.findById(7L)).thenReturn(Optional.of(booking));
        when(paymentRepository.findByBookingId(7L)).thenReturn(Optional.of(payment));
        when(uploadService.storeSingle(any(), anyString())).thenReturn("/uploads/payments/new.jpg");
        when(paymentRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        var result = service.uploadReceipt(customer.getEmail(), 7L, new MockMultipartFile("r", "r.jpg", "image/jpeg", new byte[1]));
        assertEquals("/uploads/payments/new.jpg", result.getReceiptImageUrl());
        verify(uploadService).deleteFile("/uploads/payments/old.jpg");
        assertNull(payment.getVerifiedBy());
    }

    @Test
    void uploadReceiptRejectsForeignOrNonPendingOrAlreadySubmitted() {
        User owner = user(1L, "owner@example.com");
        User other = user(2L, "other@example.com");
        Booking booking = booking(7L, owner, BookingStatus.PENDING);
        when(userRepository.findByEmail("other@example.com")).thenReturn(Optional.of(other));
        when(bookingRepository.findById(7L)).thenReturn(Optional.of(booking));
        assertThrows(UnauthorizedException.class, () -> service.uploadReceipt("other@example.com", 7L, null));
        booking.setStatus(BookingStatus.CONFIRMED);
        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(owner));
        assertThrows(ValidationException.class, () -> service.uploadReceipt("owner@example.com", 7L, null));
        booking.setStatus(BookingStatus.PENDING);
        Payment existing = payment(8L, booking, PaymentStatus.PENDING);
        when(paymentRepository.findByBookingId(7L)).thenReturn(Optional.of(existing));
        assertThrows(ValidationException.class, () -> service.uploadReceipt("owner@example.com", 7L, null));
    }

    @Test
    void verifyConfirmsPendingBookingAndRejectChangesStatus() {
        User customer = user(1L, "c@example.com");
        User admin = user(3L, "admin@example.com");
        Booking booking = booking(7L, customer, BookingStatus.PENDING);
        Payment payment = payment(8L, booking, PaymentStatus.PENDING);
        when(paymentRepository.findById(8L)).thenReturn(Optional.of(payment));
        when(userRepository.findByEmail(admin.getEmail())).thenReturn(Optional.of(admin));
        when(paymentRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        assertEquals(PaymentStatus.VERIFIED, service.verify(8L, admin.getEmail()).getStatus());
        verify(bookingService).confirm(7L);
        payment.setStatus(PaymentStatus.PENDING);
        assertEquals(PaymentStatus.REJECTED, service.reject(8L, admin.getEmail()).getStatus());
        assertEquals(admin, payment.getVerifiedBy());
    }

    private User user(Long id, String email) { User u = new User(); u.setId(id); u.setEmail(email); u.setFirstName("A"); u.setLastName("User"); return u; }
    private Booking booking(Long id, User user, BookingStatus status) { Booking b = new Booking(); b.setId(id); b.setUser(user); b.setStatus(status); b.setTotalPrice(new BigDecimal("100.00")); return b; }
    private Payment payment(Long id, Booking booking, PaymentStatus status) { Payment p = new Payment(); p.setId(id); p.setBooking(booking); p.setAmount(booking.getTotalPrice()); p.setStatus(status); return p; }
}
