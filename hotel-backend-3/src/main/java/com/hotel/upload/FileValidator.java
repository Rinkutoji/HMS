package com.hotel.upload;

import com.hotel.exception.ValidationException;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.util.Set;

@Component
public class FileValidator {

    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of("image/jpeg", "image/png", "image/webp");
    private static final long MAX_FILE_SIZE_BYTES = 5L * 1024 * 1024; // 5MB

    public void validate(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ValidationException("Uploaded file must not be empty");
        }
        if (!ALLOWED_CONTENT_TYPES.contains(file.getContentType())) {
            throw new ValidationException("Only JPEG, PNG or WEBP images are allowed");
        }
        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new ValidationException("File size must not exceed 5MB");
        }
    }
}
