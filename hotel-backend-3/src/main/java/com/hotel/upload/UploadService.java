package com.hotel.upload;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UploadService {

    private final FileValidator fileValidator;
    private final StorageUtil storageUtil;

    public String storeSingle(MultipartFile file, String subDir) {
        fileValidator.validate(file);
        return storageUtil.store(file, subDir);
    }

    public List<String> storeMultiple(List<MultipartFile> files, String subDir) {
        return files.stream()
                .map(file -> storeSingle(file, subDir))
                .collect(Collectors.toList());
    }

    public void deleteFile(String imageUrl) {
        storageUtil.delete(imageUrl);
    }
}
