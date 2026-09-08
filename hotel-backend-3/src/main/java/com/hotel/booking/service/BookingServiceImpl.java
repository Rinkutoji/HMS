package com.hotel.booking.service;

import com.hotel.booking.dto.BookingRequest;
import com.hotel.booking.dto.BookingResponse;
import com.hotel.booking.entity.Booking;
import com.hotel.booking.entity.BookingStatus;
import com.hotel.booking.repository.BookingRepository;
import com.hotel.booking.repository.BookingSpecification;
import com.hotel.exception.ResourceNotFoundException;
import com.hotel.exception.UnauthorizedException;
import com.hotel.exception.ValidationException;
import com.hotel.response.PageResponse;
import com.hotel.room.entity.Room;
import com.hotel.room.entity.RoomStatus;
import com.hotel.room.repository.RoomRepository;
import com.hotel.user.entity.User;
import com.hotel.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public BookingResponse create(String customerEmail, BookingRequest request) {
        if (!request.getCheckOutDate().isAfter(request.getCheckInDate())) {
            throw new ValidationException("Check-out date must be after check-in date");
        }

        User customer = findUserByEmail(customerEmail);
        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + request.getRoomId()));

        if (room.getStatus() != RoomStatus.AVAILABLE) {
            throw new ValidationException("This room is not available for booking");
        }

        if (bookingRepository.hasOverlappingBooking(room.getId(), request.getCheckInDate(), request.getCheckOutDate())) {
            throw new ValidationException("This room is already booked for the selected dates");
        }

        long nights = ChronoUnit.DAYS.between(request.getCheckInDate(), request.getCheckOutDate());
        BigDecimal totalPrice = room.getRoomType().getBasePrice().multiply(BigDecimal.valueOf(nights));

        Booking booking = new Booking();
        booking.setUser(customer);
        booking.setRoom(room);
        booking.setCheckInDate(request.getCheckInDate());
        booking.setCheckOutDate(request.getCheckOutDate());
        booking.setStatus(BookingStatus.PENDING);
        booking.setTotalPrice(totalPrice);

        return toResponse(bookingRepository.save(booking));
    }

    @Override
    public PageResponse<BookingResponse> getMyBookings(String customerEmail, BookingStatus status, Pageable pageable) {
        User customer = findUserByEmail(customerEmail);
        Specification<Booking> spec = Specification
                .where(BookingSpecification.hasUser(customer.getId()))
                .and(BookingSpecification.hasStatus(status));
        Page<Booking> page = bookingRepository.findAll(spec, pageable);
        return PageResponse.from(page.map(this::toResponse));
    }

    @Override
    public BookingResponse getMyBookingDetail(String customerEmail, Long id) {
        User customer = findUserByEmail(customerEmail);
        Booking booking = findById(id);
        if (!booking.getUser().getId().equals(customer.getId())) {
            throw new UnauthorizedException("You do not have access to this booking");
        }
        return toResponse(booking);
    }

    @Override
    @Transactional
    public BookingResponse cancelMyBooking(String customerEmail, Long id) {
        User customer = findUserByEmail(customerEmail);
        Booking booking = findById(id);
        if (!booking.getUser().getId().equals(customer.getId())) {
            throw new UnauthorizedException("You do not have access to this booking");
        }
        return doCancel(booking);
    }

    @Override
    public PageResponse<BookingResponse> searchBookings(BookingStatus status, LocalDate checkInDate, Pageable pageable) {
        Specification<Booking> spec = Specification
                .where(BookingSpecification.hasStatus(status))
                .and(BookingSpecification.hasCheckInDate(checkInDate));
        Page<Booking> page = bookingRepository.findAll(spec, pageable);
        return PageResponse.from(page.map(this::toResponse));
    }

    @Override
    public BookingResponse getById(Long id) {
        return toResponse(findById(id));
    }

    @Override
    @Transactional
    public BookingResponse confirm(Long id) {
        Booking booking = findById(id);
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new ValidationException("Only pending bookings can be confirmed");
        }
        booking.setStatus(BookingStatus.CONFIRMED);
        return toResponse(bookingRepository.save(booking));
    }

    @Override
    @Transactional
    public BookingResponse checkIn(Long id) {
        Booking booking = findById(id);
        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new ValidationException("Cannot check in a booking that is not confirmed");
        }
        booking.setStatus(BookingStatus.CHECKED_IN);
        return toResponse(bookingRepository.save(booking));
    }

    @Override
    @Transactional
    public BookingResponse checkOut(Long id) {
        Booking booking = findById(id);
        if (booking.getStatus() != BookingStatus.CHECKED_IN) {
            throw new ValidationException("Cannot check out a booking that has not checked in");
        }
        booking.setStatus(BookingStatus.CHECKED_OUT);
        return toResponse(bookingRepository.save(booking));
    }

    @Override
    @Transactional
    public BookingResponse cancelByStaff(Long id) {
        Booking booking = findById(id);
        return doCancel(booking);
    }

    private BookingResponse doCancel(Booking booking) {
        if (booking.getStatus() == BookingStatus.CHECKED_IN || booking.getStatus() == BookingStatus.CHECKED_OUT) {
            throw new ValidationException("Cannot cancel a booking that has already checked in or checked out");
        }
        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new ValidationException("Booking is already cancelled");
        }
        booking.setStatus(BookingStatus.CANCELLED);
        return toResponse(bookingRepository.save(booking));
    }

    private Booking findById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
    }

    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private BookingResponse toResponse(Booking booking) {
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
}
