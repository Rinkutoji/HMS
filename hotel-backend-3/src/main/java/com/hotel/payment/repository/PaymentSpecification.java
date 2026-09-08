package com.hotel.payment.repository;

import com.hotel.payment.entity.Payment;
import com.hotel.payment.entity.PaymentStatus;
import org.springframework.data.jpa.domain.Specification;

public final class PaymentSpecification {

    private PaymentSpecification() {
    }

    public static Specification<Payment> hasStatus(PaymentStatus status) {
        return (root, query, cb) -> status == null ? null : cb.equal(root.get("status"), status);
    }

    public static Specification<Payment> belongsToUser(Long userId) {
        return (root, query, cb) ->
                userId == null ? null : cb.equal(root.get("booking").get("user").get("id"), userId);
    }
}
