package com.hotel.booking.controller;

import com.hotel.booking.dto.BookingResponse;
import com.hotel.booking.entity.BookingStatus;
import com.hotel.booking.service.BookingService;
import com.hotel.response.ApiResponse;
import com.hotel.response.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/staff/bookings")
@RequiredArgsConstructor
public class StaffBookingController {

    private final BookingService bookingService;

    @GetMapping
    public ApiResponse<PageResponse<BookingResponse>> search(
            @RequestParam(required = false) BookingStatus status,
            @RequestParam(required = false) LocalDate checkInDate,
            @PageableDefault(size = 10, sort = "createdAt") Pageable pageable) {
        return ApiResponse.success(bookingService.searchBookings(status, checkInDate, pageable));
    }

    @GetMapping("/{id}")
    public ApiResponse<BookingResponse> getById(@PathVariable Long id) {
        return ApiResponse.success(bookingService.getById(id));
    }

    @PatchMapping("/{id}/confirm")
    public ApiResponse<BookingResponse> confirm(@PathVariable Long id) {
        return ApiResponse.success("Booking confirmed", bookingService.confirm(id));
    }

    @PatchMapping("/{id}/check-in")
    public ApiResponse<BookingResponse> checkIn(@PathVariable Long id) {
        return ApiResponse.success("Guest checked in", bookingService.checkIn(id));
    }

    @PatchMapping("/{id}/check-out")
    public ApiResponse<BookingResponse> checkOut(@PathVariable Long id) {
        return ApiResponse.success("Guest checked out", bookingService.checkOut(id));
    }

    @PatchMapping("/{id}/cancel")
    public ApiResponse<BookingResponse> cancel(@PathVariable Long id) {
        return ApiResponse.success("Booking cancelled", bookingService.cancelByStaff(id));
    }
}
