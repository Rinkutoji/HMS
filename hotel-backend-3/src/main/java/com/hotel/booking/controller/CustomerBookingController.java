package com.hotel.booking.controller;

import com.hotel.booking.dto.BookingRequest;
import com.hotel.booking.dto.BookingResponse;
import com.hotel.booking.entity.BookingStatus;
import com.hotel.booking.service.BookingService;
import com.hotel.response.ApiResponse;
import com.hotel.response.PageResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customer/bookings")
@RequiredArgsConstructor
public class CustomerBookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<ApiResponse<BookingResponse>> create(Authentication authentication,
                                                                 @Valid @RequestBody BookingRequest request) {
        BookingResponse response = bookingService.create(authentication.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Booking created", response));
    }

    @GetMapping
    public ApiResponse<PageResponse<BookingResponse>> getMyBookings(
            Authentication authentication,
            @RequestParam(required = false) BookingStatus status,
            @PageableDefault(size = 10, sort = "createdAt") Pageable pageable) {
        return ApiResponse.success(bookingService.getMyBookings(authentication.getName(), status, pageable));
    }

    @GetMapping("/{id}")
    public ApiResponse<BookingResponse> getById(Authentication authentication, @PathVariable Long id) {
        return ApiResponse.success(bookingService.getMyBookingDetail(authentication.getName(), id));
    }

    @PatchMapping("/{id}/cancel")
    public ApiResponse<BookingResponse> cancel(Authentication authentication, @PathVariable Long id) {
        return ApiResponse.success("Booking cancelled", bookingService.cancelMyBooking(authentication.getName(), id));
    }
}
