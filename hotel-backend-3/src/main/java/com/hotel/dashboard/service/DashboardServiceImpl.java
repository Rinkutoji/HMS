package com.hotel.dashboard.service;

import com.hotel.booking.dto.BookingResponse;
import com.hotel.booking.entity.Booking;
import com.hotel.booking.entity.BookingStatus;
import com.hotel.booking.repository.BookingRepository;
import com.hotel.booking.repository.BookingSpecification;
import com.hotel.dashboard.dto.AdminDashboardResponse;
import com.hotel.dashboard.dto.CustomerDashboardResponse;
import com.hotel.dashboard.dto.StaffDashboardResponse;
import com.hotel.exception.ResourceNotFoundException;
import com.hotel.payment.dto.PaymentResponse;
import com.hotel.payment.entity.Payment;
import com.hotel.payment.repository.PaymentRepository;
import com.hotel.room.repository.RoomRepository;
import com.hotel.user.dto.UserDTO;
import com.hotel.user.entity.RoleName;
import com.hotel.user.entity.User;
import com.hotel.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;

    @Override
    public AdminDashboardResponse getAdminDashboard() {
        long totalRooms = roomRepository.count();
        long totalCustomers = userRepository.countByRoleName(RoleName.CUSTOMER);
        long totalBookings = bookingRepository.count();
        BigDecimal totalRevenue = bookingRepository.sumTotalRevenue();

        Map<String, Long> bookingsByStatus = new LinkedHashMap<>();
        for (BookingStatus status : BookingStatus.values()) {
            bookingsByStatus.put(status.name(), 0L);
        }
        for (Object[] row : bookingRepository.countGroupedByStatus()) {
            bookingsByStatus.put(((BookingStatus) row[0]).name(), (Long) row[1]);
        }

        Map<String, BigDecimal> revenueByRoomType = new LinkedHashMap<>();
        for (Object[] row : bookingRepository.sumRevenueGroupedByRoomType()) {
            revenueByRoomType.put((String) row[0], (BigDecimal) row[1]);
        }

        Map<String, Long> bookingsByRoomType = new LinkedHashMap<>();
        for (Object[] row : bookingRepository.countGroupedByRoomType()) {
            bookingsByRoomType.put((String) row[0], (Long) row[1]);
        }

        return new AdminDashboardResponse(totalRooms, totalCustomers, totalBookings, totalRevenue,
                bookingsByStatus, revenueByRoomType, bookingsByRoomType);
    }

    @Override
    public StaffDashboardResponse getStaffDashboard() {
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.plusDays(1).atStartOfDay();

        long todaysBookings = bookingRepository.countByCreatedAtBetween(startOfDay, endOfDay);
        long todaysCheckIns = bookingRepository.countByCheckInDate(today);
        long todaysCheckOuts = bookingRepository.countByCheckOutDate(today);

        return new StaffDashboardResponse(todaysBookings, todaysCheckIns, todaysCheckOuts);
    }

    @Override
    public CustomerDashboardResponse getCustomerDashboard(String customerEmail) {
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UserDTO profile = new UserDTO(customer.getId(), customer.getFirstName(), customer.getLastName(),
                customer.getEmail(), customer.getPhone(), customer.getRole().getName().name(), customer.isActive());

        Specification<Booking> spec = Specification.where(BookingSpecification.hasUser(customer.getId()));
        long totalBookings = bookingRepository.count(spec);

        Pageable recentPageable = PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "createdAt"));
        List<BookingResponse> recentBookings = bookingRepository.findAll(spec, recentPageable)
                .map(this::toBookingResponse)
                .getContent();

        List<PaymentResponse> recentPayments = paymentRepository
                .findRecentByUser(customer.getId(), PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "createdAt")))
                .stream()
                .map(this::toPaymentResponse)
                .collect(Collectors.toList());

        return new CustomerDashboardResponse(profile, totalBookings, recentBookings, recentPayments);
    }

    private BookingResponse toBookingResponse(Booking booking) {
        return new BookingResponse(
                booking.getId(),
                booking.getUser().getId(),
                booking.getUser().getFirstName() + " " + booking.getUser().getLastName(),
                booking.getRoom().getId(),
                booking.getRoom().getRoomNumber(),
                booking.getRoom().getRoomType().getName(),
                booking.getCheckInDate(),
                booking.getCheckOutDate(),
                booking.getStatus(),
                booking.getTotalPrice(),
                booking.getCreatedAt()
        );
    }

    private PaymentResponse toPaymentResponse(Payment payment) {
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
