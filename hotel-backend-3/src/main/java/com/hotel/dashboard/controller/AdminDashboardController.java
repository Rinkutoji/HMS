package com.hotel.dashboard.controller;

import com.hotel.dashboard.dto.AdminDashboardResponse;
import com.hotel.dashboard.service.DashboardService;
import com.hotel.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public ApiResponse<AdminDashboardResponse> getDashboard() {
        return ApiResponse.success(dashboardService.getAdminDashboard());
    }
}
