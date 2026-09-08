package com.hotel.roomtype.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@AllArgsConstructor
public class RoomTypeResponse {
    private Long id;
    private String name;
    private String description;
    private BigDecimal basePrice;
    private Integer capacity;
}
