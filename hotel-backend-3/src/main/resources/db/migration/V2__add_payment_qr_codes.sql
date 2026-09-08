-- ============================================================
-- Payment QR Codes (ABA / ACLEDA / Bakong, etc.)
-- Uploaded by Admin/Staff, shown to customers during payment.
-- ============================================================

CREATE TABLE payment_qr_codes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    bank_name VARCHAR(100) NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_payment_qr_codes_active ON payment_qr_codes(is_active);
