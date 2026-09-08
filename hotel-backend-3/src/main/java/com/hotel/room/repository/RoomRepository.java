package com.hotel.room.repository;

import com.hotel.room.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface RoomRepository extends JpaRepository<Room, Long>, JpaSpecificationExecutor<Room> {
    boolean existsByRoomTypeId(Long roomTypeId);
    boolean existsByRoomNumberIgnoreCase(String roomNumber);
}
