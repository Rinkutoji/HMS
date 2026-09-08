package com.hotel.roomtype.service;

import com.hotel.exception.ResourceNotFoundException;
import com.hotel.exception.ValidationException;
import com.hotel.room.repository.RoomRepository;
import com.hotel.roomtype.dto.RoomTypeRequest;
import com.hotel.roomtype.dto.RoomTypeResponse;
import com.hotel.roomtype.entity.RoomType;
import com.hotel.roomtype.repository.RoomTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomTypeServiceImpl implements RoomTypeService {

    private final RoomTypeRepository roomTypeRepository;
    private final RoomRepository roomRepository;

    @Override
    @Transactional
    public RoomTypeResponse create(RoomTypeRequest request) {
        if (roomTypeRepository.existsByNameIgnoreCase(request.getName())) {
            throw new ValidationException("Room type with this name already exists");
        }
        RoomType roomType = new RoomType();
        applyRequest(roomType, request);
        return toResponse(roomTypeRepository.save(roomType));
    }

    @Override
    @Transactional
    public RoomTypeResponse update(Long id, RoomTypeRequest request) {
        RoomType roomType = findById(id);
        if (!roomType.getName().equalsIgnoreCase(request.getName())
                && roomTypeRepository.existsByNameIgnoreCase(request.getName())) {
            throw new ValidationException("Room type with this name already exists");
        }
        applyRequest(roomType, request);
        return toResponse(roomTypeRepository.save(roomType));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        RoomType roomType = findById(id);
        if (roomRepository.existsByRoomTypeId(id)) {
            throw new ValidationException("Cannot delete a room type that still has rooms assigned to it");
        }
        roomTypeRepository.delete(roomType);
    }

    @Override
    public RoomTypeResponse getById(Long id) {
        return toResponse(findById(id));
    }

    @Override
    public List<RoomTypeResponse> getAll() {
        return roomTypeRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private RoomType findById(Long id) {
        return roomTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room type not found with id: " + id));
    }

    private void applyRequest(RoomType roomType, RoomTypeRequest request) {
        roomType.setName(request.getName());
        roomType.setDescription(request.getDescription());
        roomType.setBasePrice(request.getBasePrice());
        roomType.setCapacity(request.getCapacity());
    }

    private RoomTypeResponse toResponse(RoomType roomType) {
        return new RoomTypeResponse(
                roomType.getId(),
                roomType.getName(),
                roomType.getDescription(),
                roomType.getBasePrice(),
                roomType.getCapacity()
        );
    }
}
