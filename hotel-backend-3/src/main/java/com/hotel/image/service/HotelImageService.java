package com.hotel.image.service;

import com.hotel.image.dto.HotelImageResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface HotelImageService {
    List<HotelImageResponse> upload(List<MultipartFile> files, String caption);
    List<HotelImageResponse> getAll();
    void delete(Long id);
}
