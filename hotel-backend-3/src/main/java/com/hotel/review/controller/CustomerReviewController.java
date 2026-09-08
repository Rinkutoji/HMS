package com.hotel.review.controller;

import com.hotel.response.ApiResponse;
import com.hotel.review.dto.ReviewRequest;
import com.hotel.review.dto.ReviewResponse;
import com.hotel.review.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customer/bookings/{bookingId}/review")
@RequiredArgsConstructor
public class CustomerReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<ApiResponse<ReviewResponse>> create(
            Authentication authentication,
            @PathVariable Long bookingId,
            @Valid @RequestBody ReviewRequest request) {
        ReviewResponse response = reviewService.create(authentication.getName(), bookingId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Review submitted", response));
    }

    @PutMapping
    public ApiResponse<ReviewResponse> update(
            Authentication authentication,
            @PathVariable Long bookingId,
            @Valid @RequestBody ReviewRequest request) {
        return ApiResponse.success("Review updated", reviewService.update(authentication.getName(), bookingId, request));
    }

    @GetMapping
    public ApiResponse<ReviewResponse> getMine(Authentication authentication, @PathVariable Long bookingId) {
        return ApiResponse.success(reviewService.getMyReview(authentication.getName(), bookingId));
    }
}