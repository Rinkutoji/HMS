package com.hotel.image.controller;

import com.hotel.image.dto.HotelImageResponse;
import com.hotel.image.service.HotelImageService;
import com.hotel.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public/hotel-images")
@RequiredArgsConstructor
public class HotelImageController {

    private final HotelImageService hotelImageService;

    @GetMapping
    public ApiResponse<List<HotelImageResponse>> getAll() {
        return ApiResponse.success(hotelImageService.getAll());
    }
}
