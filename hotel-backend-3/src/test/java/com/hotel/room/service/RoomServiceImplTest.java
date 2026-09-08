package com.hotel.room.service;

import com.hotel.exception.ValidationException;
import com.hotel.room.dto.RoomRequest;
import com.hotel.room.entity.Room;
import com.hotel.room.entity.RoomImage;
import com.hotel.room.entity.RoomStatus;
import com.hotel.room.repository.RoomImageRepository;
import com.hotel.room.repository.RoomRepository;
import com.hotel.roomtype.entity.RoomType;
import com.hotel.roomtype.repository.RoomTypeRepository;
import com.hotel.review.repository.ReviewRepository;
import com.hotel.upload.UploadService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RoomServiceImplTest {
    @Mock RoomRepository roomRepository;
    @Mock RoomTypeRepository roomTypeRepository;
    @Mock RoomImageRepository roomImageRepository;
    @Mock ReviewRepository reviewRepository;
    @Mock UploadService uploadService;
    @InjectMocks RoomServiceImpl service;
    private RoomType roomType;

    @BeforeEach
    void setUp() {
        roomType = new RoomType(); roomType.setId(1L); roomType.setName("Standard");
        roomType.setBasePrice(new BigDecimal("40")); roomType.setCapacity(2);
        lenient().when(roomImageRepository.findByRoomId(anyLong())).thenReturn(List.of());
        lenient().when(reviewRepository.findAverageRatingByRoomId(anyLong())).thenReturn(null);
        lenient().when(reviewRepository.countByRoomId(anyLong())).thenReturn(0L);
    }

    @Test
    void createDefaultsToAvailableAndMapsResponse() {
        RoomRequest request = request("101", RoomStatus.AVAILABLE);
        when(roomRepository.existsByRoomNumberIgnoreCase("101")).thenReturn(false);
        when(roomTypeRepository.findById(1L)).thenReturn(Optional.of(roomType));
        when(roomRepository.save(any(Room.class))).thenAnswer(inv -> { Room r = inv.getArgument(0); r.setId(5L); return r; });
        var response = service.create(request);
        assertEquals(5L, response.getId());
        assertEquals(RoomStatus.AVAILABLE, response.getStatus());
        assertEquals("Standard", response.getRoomTypeName());
    }

    @Test
    void createRejectsDuplicateNumbers() {
        when(roomRepository.existsByRoomNumberIgnoreCase("101")).thenReturn(true);
        assertThrows(ValidationException.class, () -> service.create(request("101", null)));
        verifyNoInteractions(roomTypeRepository);
    }

    @Test
    void uploadAndDeleteImagesManageFilesAndOwnership() {
        Room room = new Room(); room.setId(5L);
        when(roomRepository.findById(5L)).thenReturn(Optional.of(room));
        when(uploadService.storeMultiple(anyList(), eq("rooms"))).thenReturn(List.of("/uploads/rooms/a.jpg", "/uploads/rooms/b.jpg"));
        List<MultipartFile> files = List.of(new MockMultipartFile("a", "a.jpg", "image/jpeg", new byte[1]));
        assertEquals(2, service.uploadImages(5L, files).size());
        verify(roomImageRepository, times(2)).save(any(RoomImage.class));

        RoomImage image = new RoomImage(); image.setId(9L); image.setRoom(room); image.setImageUrl("/uploads/rooms/a.jpg");
        when(roomImageRepository.findById(9L)).thenReturn(Optional.of(image));
        service.deleteImage(5L, 9L);
        verify(uploadService).deleteFile(image.getImageUrl());
        verify(roomImageRepository).delete(image);
    }

    @Test
    void deleteImageRejectsImageFromAnotherRoom() {
        Room room = new Room(); room.setId(5L);
        Room other = new Room(); other.setId(6L);
        RoomImage image = new RoomImage(); image.setRoom(other);
        when(roomImageRepository.findById(9L)).thenReturn(Optional.of(image));
        assertThrows(ValidationException.class, () -> service.deleteImage(5L, 9L));
        verifyNoInteractions(uploadService);
    }

    private RoomRequest request(String number, RoomStatus status) {
        RoomRequest r = new RoomRequest(); r.setRoomNumber(number); r.setRoomTypeId(1L); r.setFloor(1); r.setDescription("Room"); r.setStatus(status); return r;
    }
}
