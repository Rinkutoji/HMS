package com.hotel.room.service;

import com.hotel.response.PageResponse;
import com.hotel.room.dto.RoomRequest;
import com.hotel.room.dto.RoomResponse;
import com.hotel.room.entity.RoomStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

public interface RoomService {
    RoomResponse create(RoomRequest request);
    RoomResponse update(Long id, RoomRequest request);
    void delete(Long id);
    RoomResponse getById(Long id);
    PageResponse<RoomResponse> search(Long roomTypeId, BigDecimal minPrice, BigDecimal maxPrice,
                                       Integer minCapacity, RoomStatus status, String keyword, Pageable pageable);
    List<String> uploadImages(Long roomId, List<MultipartFile> files);
    void deleteImage(Long roomId, Long imageId);
}
