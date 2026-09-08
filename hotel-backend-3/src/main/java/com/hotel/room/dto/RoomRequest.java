package com.hotel.room.dto;

import com.hotel.room.entity.RoomStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RoomRequest {

    @NotBlank(message = "Room number is required")
    @Size(max = 20, message = "Room number must not exceed 20 characters")
    private String roomNumber;

    @NotNull(message = "Room type is required")
    private Long roomTypeId;

    private Integer floor;

    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;

    private RoomStatus status;
}
