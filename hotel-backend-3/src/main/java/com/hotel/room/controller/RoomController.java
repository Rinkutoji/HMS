package com.hotel.room.controller;

import com.hotel.response.ApiResponse;
import com.hotel.response.PageResponse;
import com.hotel.room.dto.RoomResponse;
import com.hotel.room.entity.RoomStatus;
import com.hotel.room.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/public/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    @GetMapping
    public ApiResponse<PageResponse<RoomResponse>> search(
            @RequestParam(required = false) Long roomTypeId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Integer minCapacity,
            @RequestParam(required = false) RoomStatus status,
            @RequestParam(required = false) String keyword,
            @PageableDefault(size = 12, sort = "id") Pageable pageable) {

        return ApiResponse.success(
                roomService.search(roomTypeId, minPrice, maxPrice, minCapacity, status, keyword, pageable));
    }

    @GetMapping("/{id}")
    public ApiResponse<RoomResponse> getById(@PathVariable Long id) {
        return ApiResponse.success(roomService.getById(id));
    }
}
