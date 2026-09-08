package com.hotel.roomtype.service;

import com.hotel.exception.ValidationException;
import com.hotel.room.repository.RoomRepository;
import com.hotel.roomtype.dto.RoomTypeRequest;
import com.hotel.roomtype.entity.RoomType;
import com.hotel.roomtype.repository.RoomTypeRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RoomTypeServiceImplTest {
    @Mock RoomTypeRepository roomTypeRepository;
    @Mock RoomRepository roomRepository;
    @InjectMocks RoomTypeServiceImpl service;

    @Test
    void createMapsRequestAndRejectsDuplicate() {
        RoomTypeRequest request = request("Suite");
        when(roomTypeRepository.existsByNameIgnoreCase("Suite")).thenReturn(false);
        when(roomTypeRepository.save(any(RoomType.class))).thenAnswer(inv -> { RoomType t = inv.getArgument(0); t.setId(2L); return t; });
        assertEquals("Suite", service.create(request).getName());
        when(roomTypeRepository.existsByNameIgnoreCase("Suite")).thenReturn(true);
        assertThrows(ValidationException.class, () -> service.create(request));
    }

    @Test
    void deleteRejectsTypesWithAssignedRooms() {
        RoomType type = new RoomType(); type.setId(2L); type.setName("Suite");
        when(roomTypeRepository.findById(2L)).thenReturn(Optional.of(type));
        when(roomRepository.existsByRoomTypeId(2L)).thenReturn(true);
        assertThrows(ValidationException.class, () -> service.delete(2L));
        verify(roomTypeRepository, never()).delete(any());
    }

    private RoomTypeRequest request(String name) { RoomTypeRequest r = new RoomTypeRequest(); r.setName(name); r.setDescription("desc"); r.setBasePrice(new BigDecimal("80")); r.setCapacity(3); return r; }
}
