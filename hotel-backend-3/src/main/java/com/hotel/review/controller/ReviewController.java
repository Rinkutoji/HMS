package com.hotel.review.controller;

import com.hotel.response.ApiResponse;
import com.hotel.response.PageResponse;
import com.hotel.review.dto.ReviewResponse;
import com.hotel.review.dto.RoomRatingSummary;
import com.hotel.review.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Public read-only review endpoints, shown on room cards / detail pages.
 */
@RestController
@RequestMapping("/api/public/rooms/{roomId}/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping
    public ApiResponse<PageResponse<ReviewResponse>> list(
            @PathVariable Long roomId,
            @PageableDefault(size = 10, sort = "createdAt") Pageable pageable) {
        return ApiResponse.success(reviewService.listByRoom(roomId, pageable));
    }

    @GetMapping("/summary")
    public ApiResponse<RoomRatingSummary> summary(@PathVariable Long roomId) {
        return ApiResponse.success(reviewService.getRoomRatingSummary(roomId));
    }
}