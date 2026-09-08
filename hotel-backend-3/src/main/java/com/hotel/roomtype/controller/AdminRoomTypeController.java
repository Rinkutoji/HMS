package com.hotel.roomtype.controller;

import com.hotel.response.ApiResponse;
import com.hotel.roomtype.dto.RoomTypeRequest;
import com.hotel.roomtype.dto.RoomTypeResponse;
import com.hotel.roomtype.service.RoomTypeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/room-types")
@RequiredArgsConstructor
public class AdminRoomTypeController {

    private final RoomTypeService roomTypeService;

    @PostMapping
    public ResponseEntity<ApiResponse<RoomTypeResponse>> create(@Valid @RequestBody RoomTypeRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Room type created", roomTypeService.create(request)));
    }

    @PutMapping("/{id}")
    public ApiResponse<RoomTypeResponse> update(@PathVariable Long id, @Valid @RequestBody RoomTypeRequest request) {
        return ApiResponse.success("Room type updated", roomTypeService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        roomTypeService.delete(id);
        return ApiResponse.success("Room type deleted", null);
    }

    @GetMapping
    public ApiResponse<List<RoomTypeResponse>> getAll() {
        return ApiResponse.success(roomTypeService.getAll());
    }

    @GetMapping("/{id}")
    public ApiResponse<RoomTypeResponse> getById(@PathVariable Long id) {
        return ApiResponse.success(roomTypeService.getById(id));
    }
}
