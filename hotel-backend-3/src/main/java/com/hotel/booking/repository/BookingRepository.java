package com.hotel.booking.repository;

import com.hotel.booking.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long>, JpaSpecificationExecutor<Booking> {

    @Query("SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END FROM Booking b " +
           "WHERE b.room.id = :roomId AND b.status <> com.hotel.booking.entity.BookingStatus.CANCELLED " +
           "AND b.checkInDate < :checkOutDate AND b.checkOutDate > :checkInDate")
    boolean hasOverlappingBooking(@Param("roomId") Long roomId,
                                   @Param("checkInDate") LocalDate checkInDate,
                                   @Param("checkOutDate") LocalDate checkOutDate);

    long countByCheckInDate(LocalDate date);

    long countByCheckOutDate(LocalDate date);

    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT COALESCE(SUM(b.totalPrice), 0) FROM Booking b " +
           "WHERE b.status <> com.hotel.booking.entity.BookingStatus.CANCELLED")
    BigDecimal sumTotalRevenue();

    @Query("SELECT b.status, COUNT(b) FROM Booking b GROUP BY b.status")
    List<Object[]> countGroupedByStatus();

    @Query("SELECT b.room.roomType.name, COALESCE(SUM(b.totalPrice), 0) FROM Booking b " +
           "WHERE b.status <> com.hotel.booking.entity.BookingStatus.CANCELLED GROUP BY b.room.roomType.name")
    List<Object[]> sumRevenueGroupedByRoomType();

    @Query("SELECT b.room.roomType.name, COUNT(b) FROM Booking b GROUP BY b.room.roomType.name")
    List<Object[]> countGroupedByRoomType();

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.checkInDate BETWEEN :from AND :to")
    long countBetween(@Param("from") LocalDate from, @Param("to") LocalDate to);

    @Query("SELECT COALESCE(SUM(b.totalPrice), 0) FROM Booking b " +
           "WHERE b.status <> com.hotel.booking.entity.BookingStatus.CANCELLED AND b.checkInDate BETWEEN :from AND :to")
    BigDecimal sumRevenueBetween(@Param("from") LocalDate from, @Param("to") LocalDate to);

    @Query("SELECT b.status, COUNT(b) FROM Booking b WHERE b.checkInDate BETWEEN :from AND :to GROUP BY b.status")
    List<Object[]> countGroupedByStatusBetween(@Param("from") LocalDate from, @Param("to") LocalDate to);

    @Query("SELECT b.room.roomType.name, COALESCE(SUM(b.totalPrice), 0) FROM Booking b " +
           "WHERE b.status <> com.hotel.booking.entity.BookingStatus.CANCELLED AND b.checkInDate BETWEEN :from AND :to " +
           "GROUP BY b.room.roomType.name")
    List<Object[]> sumRevenueGroupedByRoomTypeBetween(@Param("from") LocalDate from, @Param("to") LocalDate to);
}
