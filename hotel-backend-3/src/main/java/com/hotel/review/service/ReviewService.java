package com.hotel.review.service;

import com.hotel.response.PageResponse;
import com.hotel.review.dto.ReviewRequest;
import com.hotel.review.dto.ReviewResponse;
import com.hotel.review.dto.RoomRatingSummary;
import org.springframework.data.domain.Pageable;

public interface ReviewService {
    ReviewResponse create(String customerEmail, Long bookingId, ReviewRequest request);
    ReviewResponse update(String customerEmail, Long bookingId, ReviewRequest request);
    ReviewResponse getMyReview(String customerEmail, Long bookingId);
    PageResponse<ReviewResponse> listByRoom(Long roomId, Pageable pageable);
    RoomRatingSummary getRoomRatingSummary(Long roomId);
}