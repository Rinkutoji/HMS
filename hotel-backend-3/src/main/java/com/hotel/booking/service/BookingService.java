package com.hotel.booking.service;

import com.hotel.booking.dto.BookingRequest;
import com.hotel.booking.dto.BookingResponse;
import com.hotel.booking.entity.BookingStatus;
import com.hotel.response.PageResponse;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;

public interface BookingService {
    BookingResponse create(String customerEmail, BookingRequest request);
    PageResponse<BookingResponse> getMyBookings(String customerEmail, BookingStatus status, Pageable pageable);
    BookingResponse getMyBookingDetail(String customerEmail, Long id);
    BookingResponse cancelMyBooking(String customerEmail, Long id);

    PageResponse<BookingResponse> searchBookings(BookingStatus status, LocalDate checkInDate, Pageable pageable);
    BookingResponse getById(Long id);
    BookingResponse confirm(Long id);
    BookingResponse checkIn(Long id);
    BookingResponse checkOut(Long id);
    BookingResponse cancelByStaff(Long id);
}
