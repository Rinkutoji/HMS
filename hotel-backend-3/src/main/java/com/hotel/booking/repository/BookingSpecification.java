package com.hotel.booking.repository;

import com.hotel.booking.entity.Booking;
import com.hotel.booking.entity.BookingStatus;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

public final class BookingSpecification {

    private BookingSpecification() {
    }

    public static Specification<Booking> hasUser(Long userId) {
        return (root, query, cb) -> userId == null ? null : cb.equal(root.get("user").get("id"), userId);
    }

    public static Specification<Booking> hasStatus(BookingStatus status) {
        return (root, query, cb) -> status == null ? null : cb.equal(root.get("status"), status);
    }

    public static Specification<Booking> hasCheckInDate(LocalDate date) {
        return (root, query, cb) -> date == null ? null : cb.equal(root.get("checkInDate"), date);
    }
}
