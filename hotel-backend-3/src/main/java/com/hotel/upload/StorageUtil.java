package com.hotel.upload;

import com.hotel.exception.ValidationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Component
@Slf4j
public class StorageUtil {

    @Value("${app.upload.base-dir}")
    private String baseDir;

    public String store(MultipartFile file, String subDir) {
        try {
            Path targetDir = Paths.get(baseDir, subDir);
            Files.createDirectories(targetDir);

            String extension = getExtension(file.getOriginalFilename());
            String filename = UUID.randomUUID() + extension;

            Path targetPath = targetDir.resolve(filename);
            Files.copy(file.getInputStream(), targetPath);

            return "/uploads/" + subDir + "/" + filename;
        } catch (IOException ex) {
            log.error("Failed to store file", ex);
            throw new ValidationException("Failed to store uploaded file");
        }
    }

    public void delete(String imageUrl) {
        if (imageUrl == null || !imageUrl.startsWith("/uploads/")) {
            return;
        }
        try {
            Path path = Paths.get(imageUrl.substring(1));
            Files.deleteIfExists(path);
        } catch (IOException ex) {
            log.warn("Failed to delete file {}", imageUrl, ex);
        }
    }

    private String getExtension(String originalFilename) {
        if (originalFilename == null || !originalFilename.contains(".")) {
            return "";
        }
        return originalFilename.substring(originalFilename.lastIndexOf("."));
    }
}
