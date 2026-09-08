package com.hotel.review.service;

import com.hotel.booking.entity.Booking;
import com.hotel.booking.entity.BookingStatus;
import com.hotel.booking.repository.BookingRepository;
import com.hotel.exception.UnauthorizedException;
import com.hotel.exception.ValidationException;
import com.hotel.review.dto.ReviewRequest;
import com.hotel.review.entity.Review;
import com.hotel.review.repository.ReviewRepository;
import com.hotel.room.entity.Room;
import com.hotel.user.entity.User;
import com.hotel.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReviewServiceImplTest {
    @Mock ReviewRepository reviewRepository;
    @Mock BookingRepository bookingRepository;
    @Mock UserRepository userRepository;
    @InjectMocks ReviewServiceImpl service;

    @Test
    void createAllowsCheckedOutOwnerAndMapsReview() {
        User user = user(1L); Booking booking = booking(4L, user, BookingStatus.CHECKED_OUT);
        Room room = new Room(); room.setId(6L); booking.setRoom(room);
        ReviewRequest request = request(5, "Great");
        when(userRepository.findByEmail("c@example.com")).thenReturn(Optional.of(user));
        when(bookingRepository.findById(4L)).thenReturn(Optional.of(booking));
        when(reviewRepository.findByBookingId(4L)).thenReturn(Optional.empty());
        when(reviewRepository.save(any(Review.class))).thenAnswer(inv -> { Review r = inv.getArgument(0); r.setId(8L); return r; });
        var response = service.create("c@example.com", 4L, request);
        assertEquals(8L, response.getId()); assertEquals(5, response.getRating()); assertEquals("Great", response.getComment());
    }

    @Test
    void createRejectsNonCheckoutDuplicateAndForeignBooking() {
        User user = user(1L); Booking booking = booking(4L, user, BookingStatus.CONFIRMED);
        when(userRepository.findByEmail("c@example.com")).thenReturn(Optional.of(user));
        when(bookingRepository.findById(4L)).thenReturn(Optional.of(booking));
        assertThrows(ValidationException.class, () -> service.create("c@example.com", 4L, request(3, "x")));
        booking.setStatus(BookingStatus.CHECKED_OUT);
        when(reviewRepository.findByBookingId(4L)).thenReturn(Optional.of(new Review()));
        assertThrows(ValidationException.class, () -> service.create("c@example.com", 4L, request(3, "x")));
        User other = user(2L);
        when(userRepository.findByEmail("other@example.com")).thenReturn(Optional.of(other));
        assertThrows(UnauthorizedException.class, () -> service.getMyReview("other@example.com", 4L));
    }

    @Test
    void ratingSummaryRoundsToOneDecimalAndHandlesNoRatings() {
        when(reviewRepository.findAverageRatingByRoomId(3L)).thenReturn(4.26);
        when(reviewRepository.countByRoomId(3L)).thenReturn(2L);
        assertEquals(4.3, service.getRoomRatingSummary(3L).getAverageRating());
        when(reviewRepository.findAverageRatingByRoomId(4L)).thenReturn(null);
        when(reviewRepository.countByRoomId(4L)).thenReturn(0L);
        assertNull(service.getRoomRatingSummary(4L).getAverageRating());
    }

    private ReviewRequest request(int rating, String comment) { ReviewRequest r = new ReviewRequest(); r.setRating(rating); r.setComment(comment); return r; }
    private User user(Long id) { User u = new User(); u.setId(id); u.setEmail(id == 1 ? "c@example.com" : "other@example.com"); u.setFirstName("C"); u.setLastName("User"); return u; }
    private Booking booking(Long id, User user, BookingStatus status) { Booking b = new Booking(); b.setId(id); b.setUser(user); b.setStatus(status); return b; }
}
