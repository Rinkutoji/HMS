package com.hotel.report.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;

@Getter
@AllArgsConstructor
public class RevenueReportResponse {
    private LocalDate fromDate;
    private LocalDate toDate;
    private long totalBookings;
    private BigDecimal totalRevenue;
    private Map<String, Long> bookingsByStatus;
    private Map<String, BigDecimal> revenueByRoomType;
}
