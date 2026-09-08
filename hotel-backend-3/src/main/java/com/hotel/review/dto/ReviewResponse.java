package com.hotel.review.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class ReviewResponse {
    private Long id;
    private Long bookingId;
    private Long roomId;
    private String customerName;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
}