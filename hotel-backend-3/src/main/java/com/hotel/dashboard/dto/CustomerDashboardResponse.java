package com.hotel.dashboard.dto;

import com.hotel.booking.dto.BookingResponse;
import com.hotel.payment.dto.PaymentResponse;
import com.hotel.user.dto.UserDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class CustomerDashboardResponse {
    private UserDTO profile;
    private long totalBookings;
    private List<BookingResponse> recentBookings;
    private List<PaymentResponse> recentPayments;
}
