package com.hotel.savedroom.service;

import com.hotel.exception.ResourceNotFoundException;
import com.hotel.exception.ValidationException;
import com.hotel.room.entity.Room;
import com.hotel.room.repository.RoomRepository;
import com.hotel.room.service.RoomService;
import com.hotel.savedroom.dto.SavedRoomResponse;
import com.hotel.savedroom.entity.SavedRoom;
import com.hotel.savedroom.repository.SavedRoomRepository;
import com.hotel.user.entity.User;
import com.hotel.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SavedRoomServiceImpl implements SavedRoomService {

    private final SavedRoomRepository savedRoomRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final RoomService roomService;

    @Override
    @Transactional
    public SavedRoomResponse save(String customerEmail, Long roomId) {
        User customer = findUserByEmail(customerEmail);
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + roomId));

        if (savedRoomRepository.existsByUserIdAndRoomId(customer.getId(), roomId)) {
            throw new ValidationException("Room is already saved");
        }

        SavedRoom savedRoom = new SavedRoom();
        savedRoom.setUser(customer);
        savedRoom.setRoom(room);

        SavedRoom saved = savedRoomRepository.save(savedRoom);
        return new SavedRoomResponse(saved.getId(), roomService.getById(roomId), saved.getCreatedAt());
    }

    @Override
    @Transactional
    public void unsave(String customerEmail, Long roomId) {
        User customer = findUserByEmail(customerEmail);
        SavedRoom savedRoom = savedRoomRepository.findByUserIdAndRoomId(customer.getId(), roomId)
                .orElseThrow(() -> new ResourceNotFoundException("This room is not in your saved list"));
        savedRoomRepository.delete(savedRoom);
    }

    @Override
    public List<SavedRoomResponse> listMine(String customerEmail) {
        User customer = findUserByEmail(customerEmail);
        return savedRoomRepository.findByUserIdOrderByCreatedAtDesc(customer.getId()).stream()
                .map(sr -> new SavedRoomResponse(sr.getId(), roomService.getById(sr.getRoom().getId()), sr.getCreatedAt()))
                .collect(Collectors.toList());
    }

    @Override
    public List<Long> listMySavedRoomIds(String customerEmail) {
        User customer = userRepository.findByEmail(customerEmail).orElse(null);
        if (customer == null) {
            return List.of();
        }
        return savedRoomRepository.findByUserIdOrderByCreatedAtDesc(customer.getId()).stream()
                .map(sr -> sr.getRoom().getId())
                .collect(Collectors.toList());
    }

    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}