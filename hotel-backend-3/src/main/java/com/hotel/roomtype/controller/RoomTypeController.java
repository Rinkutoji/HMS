package com.hotel.roomtype.controller;

import com.hotel.response.ApiResponse;
import com.hotel.roomtype.dto.RoomTypeResponse;
import com.hotel.roomtype.service.RoomTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public/room-types")
@RequiredArgsConstructor
public class RoomTypeController {

    private final RoomTypeService roomTypeService;

    @GetMapping
    public ApiResponse<List<RoomTypeResponse>> getAll() {
        return ApiResponse.success(roomTypeService.getAll());
    }

    @GetMapping("/{id}")
    public ApiResponse<RoomTypeResponse> getById(@PathVariable Long id) {
        return ApiResponse.success(roomTypeService.getById(id));
    }
}
