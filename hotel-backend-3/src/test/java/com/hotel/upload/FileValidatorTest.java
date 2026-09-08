package com.hotel.upload;

import com.hotel.exception.ValidationException;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

import static org.junit.jupiter.api.Assertions.*;

class FileValidatorTest {
    private final FileValidator validator = new FileValidator();

    @Test
    void acceptsSupportedImageWithinLimit() {
        assertDoesNotThrow(() -> validator.validate(new MockMultipartFile("f", "a.png", "image/png", new byte[10])));
    }

    @Test
    void rejectsEmptyUnsupportedAndOversizedFiles() {
        assertThrows(ValidationException.class, () -> validator.validate(null));
        assertThrows(ValidationException.class, () -> validator.validate(new MockMultipartFile("f", "a.txt", "text/plain", new byte[1])));
        assertThrows(ValidationException.class, () -> validator.validate(new MockMultipartFile("f", "a.jpg", "image/jpeg", new byte[5 * 1024 * 1024 + 1])));
    }
}
