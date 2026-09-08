package com.hotel.report.service;

import com.hotel.booking.entity.BookingStatus;
import com.hotel.booking.repository.BookingRepository;
import com.hotel.exception.ValidationException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReportServiceImplTest {
    @Mock BookingRepository bookingRepository;
    @InjectMocks ReportServiceImpl service;

    @Test
    void reportAggregatesTotalsAndInitializesAllStatuses() {
        LocalDate from = LocalDate.of(2030, 1, 1), to = LocalDate.of(2030, 1, 31);
        when(bookingRepository.countBetween(from, to)).thenReturn(3L);
        when(bookingRepository.sumRevenueBetween(from, to)).thenReturn(new BigDecimal("300"));
        when(bookingRepository.countGroupedByStatusBetween(from, to)).thenReturn(List.<Object[]>of(new Object[]{BookingStatus.CONFIRMED, 2L}));
        when(bookingRepository.sumRevenueGroupedByRoomTypeBetween(from, to)).thenReturn(List.<Object[]>of(new Object[]{"Deluxe", new BigDecimal("200")}));
        var response = service.getRevenueReport(from, to);
        assertEquals(3L, response.getTotalBookings());
        assertEquals(2L, response.getBookingsByStatus().get("CONFIRMED"));
        assertEquals(0L, response.getBookingsByStatus().get("CANCELLED"));
        assertEquals(new BigDecimal("200"), response.getRevenueByRoomType().get("Deluxe"));
    }

    @Test
    void reportRejectsMissingOrReversedDates() {
        assertThrows(ValidationException.class, () -> service.getRevenueReport(null, LocalDate.now()));
        assertThrows(ValidationException.class, () -> service.getRevenueReport(LocalDate.now(), LocalDate.now().minusDays(1)));
        verifyNoInteractions(bookingRepository);
    }
}
