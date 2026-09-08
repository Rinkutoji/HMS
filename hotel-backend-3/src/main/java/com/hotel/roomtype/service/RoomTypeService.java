package com.hotel.roomtype.service;

import com.hotel.roomtype.dto.RoomTypeRequest;
import com.hotel.roomtype.dto.RoomTypeResponse;

import java.util.List;

public interface RoomTypeService {
    RoomTypeResponse create(RoomTypeRequest request);
    RoomTypeResponse update(Long id, RoomTypeRequest request);
    void delete(Long id);
    RoomTypeResponse getById(Long id);
    List<RoomTypeResponse> getAll();
}
