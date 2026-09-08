package com.hotel.dashboard.service;

import com.hotel.dashboard.dto.AdminDashboardResponse;
import com.hotel.dashboard.dto.CustomerDashboardResponse;
import com.hotel.dashboard.dto.StaffDashboardResponse;

public interface DashboardService {
    AdminDashboardResponse getAdminDashboard();
    StaffDashboardResponse getStaffDashboard();
    CustomerDashboardResponse getCustomerDashboard(String customerEmail);
}
