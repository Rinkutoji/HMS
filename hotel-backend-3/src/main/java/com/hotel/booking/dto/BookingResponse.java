package com.hotel.booking.dto;

import com.hotel.booking.entity.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class BookingResponse {
    private Long id;
    private Long userId;
    private String customerName;
    private Long roomId;
    private String roomNumber;
    private String roomTypeName;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private BookingStatus status;
    private BigDecimal totalPrice;
    private LocalDateTime createdAt;
}
