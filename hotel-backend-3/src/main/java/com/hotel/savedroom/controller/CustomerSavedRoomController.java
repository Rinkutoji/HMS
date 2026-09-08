package com.hotel.savedroom.controller;

import com.hotel.response.ApiResponse;
import com.hotel.savedroom.dto.SavedRoomResponse;
import com.hotel.savedroom.service.SavedRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer/saved-rooms")
@RequiredArgsConstructor
public class CustomerSavedRoomController {

    private final SavedRoomService savedRoomService;

    @GetMapping
    public ApiResponse<List<SavedRoomResponse>> listMine(Authentication authentication) {
        return ApiResponse.success(savedRoomService.listMine(authentication.getName()));
    }

    @GetMapping("/ids")
    public ApiResponse<List<Long>> listMyRoomIds(Authentication authentication) {
        return ApiResponse.success(savedRoomService.listMySavedRoomIds(authentication.getName()));
    }

    @PostMapping("/{roomId}")
    public ResponseEntity<ApiResponse<SavedRoomResponse>> save(Authentication authentication, @PathVariable Long roomId) {
        SavedRoomResponse response = savedRoomService.save(authentication.getName(), roomId);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Room saved", response));
    }

    @DeleteMapping("/{roomId}")
    public ApiResponse<Void> unsave(Authentication authentication, @PathVariable Long roomId) {
        savedRoomService.unsave(authentication.getName(), roomId);
        return ApiResponse.success("Room removed from saved list", null);
    }
}