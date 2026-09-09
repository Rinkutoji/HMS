CREATE TABLE reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    -- Add columns matching your Review.java entity fields
    comment VARCHAR(255),
    rating INT,
    user_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);