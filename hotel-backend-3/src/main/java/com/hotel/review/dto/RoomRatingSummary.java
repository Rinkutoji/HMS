package com.hotel.review.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class RoomRatingSummary {
    private Double averageRating;
    private long reviewCount;
}