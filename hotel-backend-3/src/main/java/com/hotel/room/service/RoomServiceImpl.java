package com.hotel.room.service;

import com.hotel.exception.ResourceNotFoundException;
import com.hotel.exception.ValidationException;
import com.hotel.response.PageResponse;
import com.hotel.room.dto.RoomImageResponse;
import com.hotel.room.dto.RoomRequest;
import com.hotel.room.dto.RoomResponse;
import com.hotel.room.entity.Room;
import com.hotel.room.entity.RoomImage;
import com.hotel.room.entity.RoomStatus;
import com.hotel.room.repository.RoomImageRepository;
import com.hotel.room.repository.RoomRepository;
import com.hotel.room.repository.RoomSpecification;
import com.hotel.roomtype.entity.RoomType;
import com.hotel.roomtype.repository.RoomTypeRepository;
import com.hotel.review.repository.ReviewRepository;
import com.hotel.upload.UploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {

    private static final String UPLOAD_SUB_DIR = "rooms";

    private final RoomRepository roomRepository;
    private final RoomTypeRepository roomTypeRepository;
    private final RoomImageRepository roomImageRepository;
    private final ReviewRepository reviewRepository;
    private final UploadService uploadService;

    @Override
    @Transactional
    public RoomResponse create(RoomRequest request) {
        if (roomRepository.existsByRoomNumberIgnoreCase(request.getRoomNumber())) {
            throw new ValidationException("Room number already exists");
        }
        RoomType roomType = findRoomType(request.getRoomTypeId());

        Room room = new Room();
        room.setRoomNumber(request.getRoomNumber());
        room.setRoomType(roomType);
        room.setFloor(request.getFloor());
        room.setDescription(request.getDescription());
        room.setStatus(request.getStatus() != null ? request.getStatus() : RoomStatus.AVAILABLE);

        return toResponse(roomRepository.save(room));
    }

    @Override
    @Transactional
    public RoomResponse update(Long id, RoomRequest request) {
        Room room = findById(id);

        if (!room.getRoomNumber().equalsIgnoreCase(request.getRoomNumber())
                && roomRepository.existsByRoomNumberIgnoreCase(request.getRoomNumber())) {
            throw new ValidationException("Room number already exists");
        }

        RoomType roomType = findRoomType(request.getRoomTypeId());

        room.setRoomNumber(request.getRoomNumber());
        room.setRoomType(roomType);
        room.setFloor(request.getFloor());
        room.setDescription(request.getDescription());
        if (request.getStatus() != null) {
            room.setStatus(request.getStatus());
        }

        return toResponse(roomRepository.save(room));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Room room = findById(id);
        List<RoomImage> images = roomImageRepository.findByRoomId(id);
        images.forEach(image -> uploadService.deleteFile(image.getImageUrl()));
        roomRepository.delete(room);
    }

    @Override
    public RoomResponse getById(Long id) {
        return toResponse(findById(id));
    }

    @Override
    public PageResponse<RoomResponse> search(Long roomTypeId, BigDecimal minPrice, BigDecimal maxPrice,
                                             Integer minCapacity, RoomStatus status, String keyword, Pageable pageable) {
        Specification<Room> spec = Specification
                .where(RoomSpecification.hasRoomType(roomTypeId))
                .and(RoomSpecification.priceGreaterThanOrEqual(minPrice))
                .and(RoomSpecification.priceLessThanOrEqual(maxPrice))
                .and(RoomSpecification.capacityGreaterThanOrEqual(minCapacity))
                .and(RoomSpecification.hasStatus(status))
                .and(RoomSpecification.keyword(keyword));

        Page<Room> page = roomRepository.findAll(spec, pageable);
        return PageResponse.from(page.map(this::toResponse));
    }

    @Override
    @Transactional
    public List<String> uploadImages(Long roomId, List<MultipartFile> files) {
        Room room = findById(roomId);
        List<String> urls = uploadService.storeMultiple(files, UPLOAD_SUB_DIR);

        urls.forEach(url -> {
            RoomImage image = new RoomImage();
            image.setRoom(room);
            image.setImageUrl(url);
            roomImageRepository.save(image);
        });

        return urls;
    }

    @Override
    @Transactional
    public void deleteImage(Long roomId, Long imageId) {
        RoomImage image = roomImageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("Image not found with id: " + imageId));

        if (!image.getRoom().getId().equals(roomId)) {
            throw new ValidationException("Image does not belong to this room");
        }

        uploadService.deleteFile(image.getImageUrl());
        roomImageRepository.delete(image);
    }

    private Room findById(Long id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + id));
    }

    private RoomType findRoomType(Long roomTypeId) {
        return roomTypeRepository.findById(roomTypeId)
                .orElseThrow(() -> new ResourceNotFoundException("Room type not found with id: " + roomTypeId));
    }

    private RoomResponse toResponse(Room room) {
        List<RoomImageResponse> images = roomImageRepository.findByRoomId(room.getId()).stream()
                .map(img -> new RoomImageResponse(img.getId(), img.getImageUrl()))
                .collect(Collectors.toList());

        Double rawAverage = reviewRepository.findAverageRatingByRoomId(room.getId());
        Double averageRating = rawAverage == null ? null : Math.round(rawAverage * 10.0) / 10.0;
        long reviewCount = reviewRepository.countByRoomId(room.getId());

        return new RoomResponse(
                room.getId(),
                room.getRoomNumber(),
                room.getRoomType().getId(),
                room.getRoomType().getName(),
                room.getRoomType().getBasePrice(),
                room.getRoomType().getCapacity(),
                room.getFloor(),
                room.getStatus(),
                room.getDescription(),
                images,
                averageRating,
                reviewCount
        );
    }
}