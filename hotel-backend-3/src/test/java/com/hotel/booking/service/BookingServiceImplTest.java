package com.hotel.booking.service;

import com.hotel.booking.dto.BookingRequest;
import com.hotel.booking.entity.Booking;
import com.hotel.booking.entity.BookingStatus;
import com.hotel.booking.repository.BookingRepository;
import com.hotel.exception.UnauthorizedException;
import com.hotel.exception.ValidationException;
import com.hotel.room.entity.Room;
import com.hotel.room.entity.RoomStatus;
import com.hotel.room.repository.RoomRepository;
import com.hotel.roomtype.entity.RoomType;
import com.hotel.user.entity.User;
import com.hotel.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookingServiceImplTest {
    @Mock BookingRepository bookingRepository;
    @Mock RoomRepository roomRepository;
    @Mock UserRepository userRepository;
    @InjectMocks BookingServiceImpl service;
    private User customer;
    private Room room;

    @BeforeEach
    void setUp() {
        customer = user(1L, "customer@example.com");
        RoomType type = new RoomType();
        type.setId(4L); type.setName("Deluxe"); type.setBasePrice(new BigDecimal("50.00")); type.setCapacity(2);
        room = new Room(); room.setId(2L); room.setRoomNumber("201"); room.setRoomType(type); room.setStatus(RoomStatus.AVAILABLE);
    }

    @Test
    void createCalculatesPriceAndStartsPending() {
        BookingRequest request = request(2L, LocalDate.of(2030, 1, 10), LocalDate.of(2030, 1, 13));
        when(userRepository.findByEmail("customer@example.com")).thenReturn(Optional.of(customer));
        when(roomRepository.findById(2L)).thenReturn(Optional.of(room));
        when(bookingRepository.hasOverlappingBooking(eq(2L), any(), any())).thenReturn(false);
        when(bookingRepository.save(any(Booking.class))).thenAnswer(inv -> inv.getArgument(0));

        var response = service.create("customer@example.com", request);

        assertEquals(new BigDecimal("150.00"), response.getTotalPrice());
        assertEquals(BookingStatus.PENDING, response.getStatus());
        verify(bookingRepository).save(argThat(b -> b.getUser() == customer && b.getRoom() == room));
    }

    @Test
    void createRejectsInvalidDatesUnavailableRoomsAndOverlaps() {
        BookingRequest invalid = request(2L, LocalDate.of(2030, 1, 2), LocalDate.of(2030, 1, 2));
        assertThrows(ValidationException.class, () -> service.create("customer@example.com", invalid));

        BookingRequest valid = request(2L, LocalDate.of(2030, 1, 2), LocalDate.of(2030, 1, 3));
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(customer));
        when(roomRepository.findById(2L)).thenReturn(Optional.of(room));
        room.setStatus(RoomStatus.MAINTENANCE);
        assertThrows(ValidationException.class, () -> service.create("customer@example.com", valid));
        room.setStatus(RoomStatus.AVAILABLE);
        when(bookingRepository.hasOverlappingBooking(anyLong(), any(), any())).thenReturn(true);
        assertThrows(ValidationException.class, () -> service.create("customer@example.com", valid));
    }

    @Test
    void lifecycleTransitionsRequireExpectedStatus() {
        Booking booking = booking(BookingStatus.PENDING);
        when(bookingRepository.findById(10L)).thenReturn(Optional.of(booking));
        when(bookingRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        assertEquals(BookingStatus.CONFIRMED, service.confirm(10L).getStatus());
        booking.setStatus(BookingStatus.CONFIRMED);
        assertEquals(BookingStatus.CHECKED_IN, service.checkIn(10L).getStatus());
        booking.setStatus(BookingStatus.CHECKED_IN);
        assertEquals(BookingStatus.CHECKED_OUT, service.checkOut(10L).getStatus());
        verify(bookingRepository, times(3)).save(booking);
    }

    @Test
    void lifecycleRejectsUnexpectedStatusAndUnauthorizedAccess() {
        Booking booking = booking(BookingStatus.CHECKED_IN);
        when(bookingRepository.findById(10L)).thenReturn(Optional.of(booking));
        assertThrows(ValidationException.class, () -> service.confirm(10L));
        assertThrows(ValidationException.class, () -> service.cancelByStaff(10L));
        User other = user(9L, "other@example.com");
        when(userRepository.findByEmail("other@example.com")).thenReturn(Optional.of(other));
        assertThrows(UnauthorizedException.class, () -> service.getMyBookingDetail("other@example.com", 10L));
    }

    private BookingRequest request(Long roomId, LocalDate in, LocalDate out) {
        BookingRequest request = new BookingRequest();
        request.setRoomId(roomId); request.setCheckInDate(in); request.setCheckOutDate(out);
        return request;
    }
    private Booking booking(BookingStatus status) {
        Booking booking = new Booking(); booking.setId(10L); booking.setUser(customer); booking.setRoom(room);
        booking.setCheckInDate(LocalDate.of(2030, 1, 2)); booking.setCheckOutDate(LocalDate.of(2030, 1, 3));
        booking.setStatus(status); booking.setTotalPrice(new BigDecimal("50.00")); return booking;
    }
    private User user(Long id, String email) {
        User user = new User(); user.setId(id); user.setEmail(email); user.setFirstName("Test"); user.setLastName("User"); return user;
    }
}
