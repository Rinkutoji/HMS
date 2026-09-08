package com.hotel.savedroom.repository;

import com.hotel.savedroom.entity.SavedRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SavedRoomRepository extends JpaRepository<SavedRoom, Long> {
    boolean existsByUserIdAndRoomId(Long userId, Long roomId);
    Optional<SavedRoom> findByUserIdAndRoomId(Long userId, Long roomId);
    List<SavedRoom> findByUserIdOrderByCreatedAtDesc(Long userId);
}