package com.hotel.room.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class RoomStatusConverter implements AttributeConverter<RoomStatus, String> {

    @Override
    public String convertToDatabaseColumn(RoomStatus status) {
        return status != null ? status.name() : null;
    }

    @Override
    public RoomStatus convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isEmpty()) {
            return null;
        }
        try {
            return RoomStatus.valueOf(dbData.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid RoomStatus value: " + dbData);
        }
    }
}
