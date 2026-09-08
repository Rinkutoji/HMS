package com.hotel.dashboard.controller;

import com.hotel.dashboard.dto.CustomerDashboardResponse;
import com.hotel.dashboard.service.DashboardService;
import com.hotel.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/customer/dashboard")
@RequiredArgsConstructor
public class CustomerDashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public ApiResponse<CustomerDashboardResponse> getDashboard(Authentication authentication) {
        return ApiResponse.success(dashboardService.getCustomerDashboard(authentication.getName()));
    }
}
