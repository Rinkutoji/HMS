package com.hotel.room.controller;

import com.hotel.response.ApiResponse;
import com.hotel.room.dto.RoomRequest;
import com.hotel.room.dto.RoomResponse;
import com.hotel.room.service.RoomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/admin/rooms")
@RequiredArgsConstructor
public class AdminRoomController {

    private final RoomService roomService;

    @PostMapping
    public ResponseEntity<ApiResponse<RoomResponse>> create(@Valid @RequestBody RoomRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Room created", roomService.create(request)));
    }

    @PutMapping("/{id}")
    public ApiResponse<RoomResponse> update(@PathVariable Long id, @Valid @RequestBody RoomRequest request) {
        return ApiResponse.success("Room updated", roomService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        roomService.delete(id);
        return ApiResponse.success("Room deleted", null);
    }

    @GetMapping("/{id}")
    public ApiResponse<RoomResponse> getById(@PathVariable Long id) {
        return ApiResponse.success(roomService.getById(id));
    }

    @PostMapping("/{id}/images")
    public ApiResponse<List<String>> uploadImages(@PathVariable Long id,
                                                    @RequestParam("files") List<MultipartFile> files) {
        return ApiResponse.success("Images uploaded", roomService.uploadImages(id, files));
    }

    @DeleteMapping("/{id}/images/{imageId}")
    public ApiResponse<Void> deleteImage(@PathVariable Long id, @PathVariable Long imageId) {
        roomService.deleteImage(id, imageId);
        return ApiResponse.success("Image deleted", null);
    }
}
