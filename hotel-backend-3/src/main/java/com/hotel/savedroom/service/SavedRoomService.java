package com.hotel.savedroom.service;

import com.hotel.savedroom.dto.SavedRoomResponse;

import java.util.List;

public interface SavedRoomService {
    SavedRoomResponse save(String customerEmail, Long roomId);
    void unsave(String customerEmail, Long roomId);
    List<SavedRoomResponse> listMine(String customerEmail);
    List<Long> listMySavedRoomIds(String customerEmail);
}