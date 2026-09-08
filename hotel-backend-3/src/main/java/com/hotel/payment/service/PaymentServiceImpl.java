package com.hotel.payment.service;

import com.hotel.booking.entity.Booking;
import com.hotel.booking.entity.BookingStatus;
import com.hotel.booking.repository.BookingRepository;
import com.hotel.booking.service.BookingService;
import com.hotel.exception.ResourceNotFoundException;
import com.hotel.exception.UnauthorizedException;
import com.hotel.exception.ValidationException;
import com.hotel.payment.dto.PaymentResponse;
import com.hotel.payment.entity.Payment;
import com.hotel.payment.entity.PaymentStatus;
import com.hotel.payment.repository.PaymentRepository;
import com.hotel.payment.repository.PaymentSpecification;
import com.hotel.response.PageResponse;
import com.hotel.upload.UploadService;
import com.hotel.user.entity.User;
import com.hotel.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private static final String UPLOAD_SUB_DIR = "payments";

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final BookingService bookingService;
    private final UserRepository userRepository;
    private final UploadService uploadService;

    @Override
    @Transactional
    public PaymentResponse uploadReceipt(String customerEmail, Long bookingId, MultipartFile file) {
        User customer = findUserByEmail(customerEmail);
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        if (!booking.getUser().getId().equals(customer.getId())) {
            throw new UnauthorizedException("You do not have access to this booking");
        }

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new ValidationException("Receipt can only be uploaded for a pending booking");
        }

        Payment payment = paymentRepository.findByBookingId(bookingId).orElse(null);

        if (payment != null && payment.getStatus() != PaymentStatus.REJECTED) {
            throw new ValidationException("A receipt has already been submitted for this booking");
        }

        String url = uploadService.storeSingle(file, UPLOAD_SUB_DIR);

        if (payment == null) {
            payment = new Payment();
            payment.setBooking(booking);
            payment.setAmount(booking.getTotalPrice());
        } else {
            uploadService.deleteFile(payment.getReceiptImageUrl());
            payment.setVerifiedBy(null);
            payment.setVerifiedAt(null);
        }

        payment.setReceiptImageUrl(url);
        payment.setStatus(PaymentStatus.PENDING);

        return toResponse(paymentRepository.save(payment));
    }

    @Override
    public PaymentResponse getMyPaymentStatus(String customerEmail, Long bookingId) {
        User customer = findUserByEmail(customerEmail);
        Payment payment = paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("No payment found for this booking"));

        if (!payment.getBooking().getUser().getId().equals(customer.getId())) {
            throw new UnauthorizedException("You do not have access to this payment");
        }
        return toResponse(payment);
    }

    @Override
    public PageResponse<PaymentResponse> getMyPayments(String customerEmail, Pageable pageable) {
        User customer = findUserByEmail(customerEmail);
        Specification<Payment> spec = Specification.where(PaymentSpecification.belongsToUser(customer.getId()));
        Page<Payment> page = paymentRepository.findAll(spec, pageable);
        return PageResponse.from(page.map(this::toResponse));
    }

    @Override
    public PageResponse<PaymentResponse> search(PaymentStatus status, Pageable pageable) {
        Specification<Payment> spec = Specification.where(PaymentSpecification.hasStatus(status));
        Page<Payment> page = paymentRepository.findAll(spec, pageable);
        return PageResponse.from(page.map(this::toResponse));
    }

    @Override
    public PaymentResponse getById(Long id) {
        return toResponse(findById(id));
    }

    @Override
    @Transactional
    public PaymentResponse verify(Long id, String adminEmail) {
        Payment payment = findById(id);
        if (payment.getStatus() != PaymentStatus.PENDING) {
            throw new ValidationException("Only pending payments can be verified");
        }

        User admin = findUserByEmail(adminEmail);
        payment.setStatus(PaymentStatus.VERIFIED);
        payment.setVerifiedBy(admin);
        payment.setVerifiedAt(LocalDateTime.now());
        Payment saved = paymentRepository.save(payment);

        Booking booking = saved.getBooking();
        if (booking.getStatus() == BookingStatus.PENDING) {
            bookingService.confirm(booking.getId());
        }

        return toResponse(saved);
    }

    @Override
    @Transactional
    public PaymentResponse reject(Long id, String adminEmail) {
        Payment payment = findById(id);
        if (payment.getStatus() != PaymentStatus.PENDING) {
            throw new ValidationException("Only pending payments can be rejected");
        }

        User admin = findUserByEmail(adminEmail);
        payment.setStatus(PaymentStatus.REJECTED);
        payment.setVerifiedBy(admin);
        payment.setVerifiedAt(LocalDateTime.now());

        return toResponse(paymentRepository.save(payment));
    }

    private Payment findById(Long id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + id));
    }

    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private PaymentResponse toResponse(Payment payment) {
        return new PaymentResponse(
                payment.getId(),
                payment.getBooking().getId(),
                payment.getReceiptImageUrl(),
                payment.getAmount(),
                payment.getStatus(),
                payment.getVerifiedBy() != null
                        ? payment.getVerifiedBy().getFirstName() + " " + payment.getVerifiedBy().getLastName()
                        : null,
                payment.getVerifiedAt(),
                payment.getCreatedAt()
        );
    }
}
