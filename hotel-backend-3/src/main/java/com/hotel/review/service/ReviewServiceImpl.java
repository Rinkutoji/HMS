package com.hotel.review.service;

import com.hotel.booking.entity.Booking;
import com.hotel.booking.entity.BookingStatus;
import com.hotel.booking.repository.BookingRepository;
import com.hotel.exception.ResourceNotFoundException;
import com.hotel.exception.UnauthorizedException;
import com.hotel.exception.ValidationException;
import com.hotel.response.PageResponse;
import com.hotel.review.dto.ReviewRequest;
import com.hotel.review.dto.ReviewResponse;
import com.hotel.review.dto.RoomRatingSummary;
import com.hotel.review.entity.Review;
import com.hotel.review.repository.ReviewRepository;
import com.hotel.user.entity.User;
import com.hotel.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public ReviewResponse create(String customerEmail, Long bookingId, ReviewRequest request) {
        Booking booking = findOwnedBooking(customerEmail, bookingId);

        if (booking.getStatus() != BookingStatus.CHECKED_OUT) {
            throw new ValidationException("You can only review a booking after your stay is checked out");
        }
        if (reviewRepository.findByBookingId(bookingId).isPresent()) {
            throw new ValidationException("You have already reviewed this booking");
        }

        Review review = new Review();
        review.setBooking(booking);
        review.setRating(request.getRating());
        review.setComment(request.getComment());

        return toResponse(reviewRepository.save(review));
    }

    @Override
    @Transactional
    public ReviewResponse update(String customerEmail, Long bookingId, ReviewRequest request) {
        findOwnedBooking(customerEmail, bookingId);

        Review review = reviewRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("No review found for this booking"));

        review.setRating(request.getRating());
        review.setComment(request.getComment());

        return toResponse(reviewRepository.save(review));
    }

    @Override
    public ReviewResponse getMyReview(String customerEmail, Long bookingId) {
        findOwnedBooking(customerEmail, bookingId);

        Review review = reviewRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("No review found for this booking"));

        return toResponse(review);
    }

    @Override
    public PageResponse<ReviewResponse> listByRoom(Long roomId, Pageable pageable) {
        Page<Review> page = reviewRepository.findByRoomId(roomId, pageable);
        return PageResponse.from(page.map(this::toResponse));
    }

    @Override
    public RoomRatingSummary getRoomRatingSummary(Long roomId) {
        Double average = reviewRepository.findAverageRatingByRoomId(roomId);
        long count = reviewRepository.countByRoomId(roomId);
        Double rounded = average == null ? null : Math.round(average * 10.0) / 10.0;
        return new RoomRatingSummary(rounded, count);
    }

    private Booking findOwnedBooking(String customerEmail, Long bookingId) {
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        if (!booking.getUser().getId().equals(customer.getId())) {
            throw new UnauthorizedException("You do not have access to this booking");
        }

        return booking;
    }

    private ReviewResponse toResponse(Review review) {
        Booking booking = review.getBooking();
        return new ReviewResponse(
                review.getId(),
                booking.getId(),
                booking.getRoom().getId(),
                booking.getUser().getFirstName() + " " + booking.getUser().getLastName(),
                review.getRating(),
                review.getComment(),
                review.getCreatedAt()
        );
    }
}