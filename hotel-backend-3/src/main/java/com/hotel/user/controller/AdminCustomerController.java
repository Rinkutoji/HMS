package com.hotel.user.controller;

import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hotel.response.ApiResponse;
import com.hotel.response.PageResponse;
import com.hotel.user.dto.UserDTO;
import com.hotel.user.entity.RoleName;
import com.hotel.user.service.UserManagementService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping({"/api/admin/customers", "/api/admin/users"})
@RequiredArgsConstructor
public class AdminCustomerController {

    private final UserManagementService userManagementService;

    @GetMapping
    public ApiResponse<PageResponse<UserDTO>> list(
            @RequestParam(required = false) String keyword,
            @PageableDefault(size = 10, sort = "id") Pageable pageable) {
        return ApiResponse.success(userManagementService.listByRole(RoleName.CUSTOMER, keyword, pageable));
    }

    @PatchMapping("/{id}/activate")
    public ApiResponse<UserDTO> activate(@PathVariable Long id) {
        return ApiResponse.success("Customer activated", userManagementService.setActive(id, true));
    }

    @PatchMapping("/{id}/deactivate")
    public ApiResponse<UserDTO> deactivate(@PathVariable Long id) {
        return ApiResponse.success("Customer deactivated", userManagementService.setActive(id, false));
    }
}
