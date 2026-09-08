package com.hotel.user.controller;

import com.hotel.response.ApiResponse;
import com.hotel.response.PageResponse;
import com.hotel.user.dto.CreateStaffRequest;
import com.hotel.user.dto.UserDTO;
import com.hotel.user.entity.RoleName;
import com.hotel.user.service.UserManagementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/staff")
@RequiredArgsConstructor
public class AdminStaffController {

    private final UserManagementService userManagementService;

    @PostMapping
    public ResponseEntity<ApiResponse<UserDTO>> create(@Valid @RequestBody CreateStaffRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Staff account created", userManagementService.createStaff(request)));
    }

    @GetMapping
    public ApiResponse<PageResponse<UserDTO>> list(
            @RequestParam(required = false) String keyword,
            @PageableDefault(size = 10, sort = "id") Pageable pageable) {
        return ApiResponse.success(userManagementService.listByRole(RoleName.STAFF, keyword, pageable));
    }

    @PatchMapping("/{id}/activate")
    public ApiResponse<UserDTO> activate(@PathVariable Long id) {
        return ApiResponse.success("Staff activated", userManagementService.setActive(id, true));
    }

    @PatchMapping("/{id}/deactivate")
    public ApiResponse<UserDTO> deactivate(@PathVariable Long id) {
        return ApiResponse.success("Staff deactivated", userManagementService.setActive(id, false));
    }
}
