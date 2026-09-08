package com.hotel.user.repository;

import com.hotel.user.entity.RoleName;
import com.hotel.user.entity.User;
import org.springframework.data.jpa.domain.Specification;

public final class UserSpecification {

    private UserSpecification() {
    }

    public static Specification<User> hasRole(RoleName role) {
        return (root, query, cb) -> role == null ? null : cb.equal(root.get("role").get("name"), role);
    }

    public static Specification<User> keyword(String keyword) {
        return (root, query, cb) -> {
            if (keyword == null || keyword.isBlank()) {
                return null;
            }
            String pattern = "%" + keyword.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("firstName")), pattern),
                    cb.like(cb.lower(root.get("lastName")), pattern),
                    cb.like(cb.lower(root.get("email")), pattern)
            );
        };
    }
}
