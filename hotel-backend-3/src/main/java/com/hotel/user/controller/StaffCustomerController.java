package com.hotel.user.controller;

import com.hotel.response.ApiResponse;
import com.hotel.response.PageResponse;
import com.hotel.user.dto.UserDTO;
import com.hotel.user.entity.RoleName;
import com.hotel.user.service.UserManagementService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/staff/customers")
@RequiredArgsConstructor
public class StaffCustomerController {

    private final UserManagementService userManagementService;

    @GetMapping
    public ApiResponse<PageResponse<UserDTO>> list(
            @RequestParam(required = false) String keyword,
            @PageableDefault(size = 10, sort = "id") Pageable pageable) {
        return ApiResponse.success(userManagementService.listByRole(RoleName.CUSTOMER, keyword, pageable));
    }
}
