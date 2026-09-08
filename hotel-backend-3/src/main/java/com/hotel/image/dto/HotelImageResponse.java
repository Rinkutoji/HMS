package com.hotel.image.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class HotelImageResponse {
    private Long id;
    private String imageUrl;
    private String caption;
}
