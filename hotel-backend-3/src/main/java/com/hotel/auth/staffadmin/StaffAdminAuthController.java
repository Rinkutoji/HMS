package com.hotel.auth.staffadmin;

import com.hotel.auth.dto.AuthResponse;
import com.hotel.auth.staffadmin.dto.StaffLoginRequest;
import com.hotel.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/auth")
@RequiredArgsConstructor
public class StaffAdminAuthController {

    private final StaffAdminAuthService staffAdminAuthService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody StaffLoginRequest request) {
        AuthResponse response = staffAdminAuthService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }
}
