package com.hotel.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.Map;

@Getter
@AllArgsConstructor
public class AdminDashboardResponse {
    private long totalRooms;
    private long totalCustomers;
    private long totalBookings;
    private BigDecimal totalRevenue;
    private Map<String, Long> bookingsByStatus;
    private Map<String, BigDecimal> revenueByRoomType;
    private Map<String, Long> bookingsByRoomType;
}
