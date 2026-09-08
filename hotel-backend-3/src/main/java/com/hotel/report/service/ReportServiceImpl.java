package com.hotel.report.service;

import com.hotel.booking.entity.BookingStatus;
import com.hotel.booking.repository.BookingRepository;
import com.hotel.exception.ValidationException;
import com.hotel.report.dto.RevenueReportResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final BookingRepository bookingRepository;

    @Override
    public RevenueReportResponse getRevenueReport(LocalDate from, LocalDate to) {
        if (from == null || to == null) {
            throw new ValidationException("Both 'from' and 'to' dates are required");
        }
        if (to.isBefore(from)) {
            throw new ValidationException("'to' date must not be before 'from' date");
        }

        long totalBookings = bookingRepository.countBetween(from, to);
        BigDecimal totalRevenue = bookingRepository.sumRevenueBetween(from, to);

        Map<String, Long> bookingsByStatus = new LinkedHashMap<>();
        for (BookingStatus status : BookingStatus.values()) {
            bookingsByStatus.put(status.name(), 0L);
        }
        for (Object[] row : bookingRepository.countGroupedByStatusBetween(from, to)) {
            bookingsByStatus.put(((BookingStatus) row[0]).name(), (Long) row[1]);
        }

        Map<String, BigDecimal> revenueByRoomType = new LinkedHashMap<>();
        for (Object[] row : bookingRepository.sumRevenueGroupedByRoomTypeBetween(from, to)) {
            revenueByRoomType.put((String) row[0], (BigDecimal) row[1]);
        }

        return new RevenueReportResponse(from, to, totalBookings, totalRevenue, bookingsByStatus, revenueByRoomType);
    }
}
