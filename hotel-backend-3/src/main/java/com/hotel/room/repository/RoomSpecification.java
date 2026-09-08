package com.hotel.room.repository;

import com.hotel.room.entity.Room;
import com.hotel.room.entity.RoomStatus;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;

public final class RoomSpecification {

    private RoomSpecification() {
    }

    public static Specification<Room> hasRoomType(Long roomTypeId) {
        return (root, query, cb) ->
                roomTypeId == null ? null : cb.equal(root.get("roomType").get("id"), roomTypeId);
    }

    public static Specification<Room> priceGreaterThanOrEqual(BigDecimal minPrice) {
        return (root, query, cb) ->
                minPrice == null ? null : cb.greaterThanOrEqualTo(root.get("roomType").get("basePrice"), minPrice);
    }

    public static Specification<Room> priceLessThanOrEqual(BigDecimal maxPrice) {
        return (root, query, cb) ->
                maxPrice == null ? null : cb.lessThanOrEqualTo(root.get("roomType").get("basePrice"), maxPrice);
    }

    public static Specification<Room> capacityGreaterThanOrEqual(Integer minCapacity) {
        return (root, query, cb) ->
                minCapacity == null ? null : cb.greaterThanOrEqualTo(root.get("roomType").get("capacity"), minCapacity);
    }

    public static Specification<Room> hasStatus(RoomStatus status) {
        return (root, query, cb) -> status == null ? null : cb.equal(root.get("status"), status);
    }

    public static Specification<Room> keyword(String keyword) {
        return (root, query, cb) -> {
            if (keyword == null || keyword.isBlank()) {
                return null;
            }
            String pattern = "%" + keyword.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("roomNumber")), pattern),
                    cb.like(cb.lower(root.get("description")), pattern),
                    cb.like(cb.lower(root.get("roomType").get("name")), pattern)
            );
        };
    }
}
