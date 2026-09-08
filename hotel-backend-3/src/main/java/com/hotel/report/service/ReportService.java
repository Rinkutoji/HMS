package com.hotel.report.service;

import com.hotel.report.dto.RevenueReportResponse;

import java.time.LocalDate;

public interface ReportService {
    RevenueReportResponse getRevenueReport(LocalDate from, LocalDate to);
}
