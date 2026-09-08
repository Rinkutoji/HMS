package com.hotel.dashboard.controller;

import com.hotel.dashboard.dto.StaffDashboardResponse;
import com.hotel.dashboard.service.DashboardService;
import com.hotel.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/staff/dashboard")
@RequiredArgsConstructor
public class StaffDashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public ApiResponse<StaffDashboardResponse> getDashboard() {
        return ApiResponse.success(dashboardService.getStaffDashboard());
    }
}
