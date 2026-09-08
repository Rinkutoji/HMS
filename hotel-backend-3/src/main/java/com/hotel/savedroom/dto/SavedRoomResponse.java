package com.hotel.savedroom.dto;

import com.hotel.room.dto.RoomResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class SavedRoomResponse {
    private Long id;
    private RoomResponse room;
    private LocalDateTime savedAt;
}