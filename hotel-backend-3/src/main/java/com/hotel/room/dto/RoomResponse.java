package com.hotel.room.dto;

import com.hotel.room.entity.RoomStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@AllArgsConstructor
public class RoomResponse {
    private Long id;
    private String roomNumber;
    private Long roomTypeId;
    private String roomTypeName;
    private BigDecimal basePrice;
    private Integer capacity;
    private Integer floor;
    private RoomStatus status;
    private String description;
    private List<RoomImageResponse> images;
    private Double averageRating;
    private Long reviewCount;
}