package com.hotel.room.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class RoomImageResponse {
    private Long id;
    private String imageUrl;
}
