package com.hotel.user.controller;

import com.hotel.response.ApiResponse;
import com.hotel.user.dto.UpdateProfileRequest;
import com.hotel.user.dto.UserDTO;
import com.hotel.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customer/profile")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ApiResponse<UserDTO> getProfile(Authentication authentication) {
        return ApiResponse.success(userService.getProfile(authentication.getName()));
    }

    @PutMapping
    public ApiResponse<UserDTO> updateProfile(Authentication authentication,
                                               @Valid @RequestBody UpdateProfileRequest request) {
        return ApiResponse.success("Profile updated successfully",
                userService.updateProfile(authentication.getName(), request));
    }
}
