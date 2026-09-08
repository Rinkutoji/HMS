package com.hotel.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class StaffDashboardResponse {
    private long todaysBookings;
    private long todaysCheckIns;
    private long todaysCheckOuts;
}
