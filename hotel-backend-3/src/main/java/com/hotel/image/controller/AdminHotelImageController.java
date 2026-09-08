package com.hotel.image.controller;

import com.hotel.image.dto.HotelImageResponse;
import com.hotel.image.service.HotelImageService;
import com.hotel.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/admin/hotel-images")
@RequiredArgsConstructor
public class AdminHotelImageController {

    private final HotelImageService hotelImageService;

    @PostMapping
    public ApiResponse<List<HotelImageResponse>> upload(@RequestParam("files") List<MultipartFile> files,
                                                          @RequestParam(required = false) String caption) {
        return ApiResponse.success("Hotel images uploaded", hotelImageService.upload(files, caption));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        hotelImageService.delete(id);
        return ApiResponse.success("Hotel image deleted", null);
    }
}
