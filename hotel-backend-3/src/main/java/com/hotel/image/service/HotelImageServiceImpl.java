package com.hotel.image.service;

import com.hotel.exception.ResourceNotFoundException;
import com.hotel.image.dto.HotelImageResponse;
import com.hotel.image.entity.HotelImage;
import com.hotel.image.repository.HotelImageRepository;
import com.hotel.upload.UploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HotelImageServiceImpl implements HotelImageService {

    private static final String UPLOAD_SUB_DIR = "hotels";

    private final HotelImageRepository hotelImageRepository;
    private final UploadService uploadService;

    @Override
    @Transactional
    public List<HotelImageResponse> upload(List<MultipartFile> files, String caption) {
        List<String> urls = uploadService.storeMultiple(files, UPLOAD_SUB_DIR);

        return urls.stream()
                .map(url -> {
                    HotelImage image = new HotelImage();
                    image.setImageUrl(url);
                    image.setCaption(caption);
                    return toResponse(hotelImageRepository.save(image));
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<HotelImageResponse> getAll() {
        return hotelImageRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void delete(Long id) {
        HotelImage image = hotelImageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel image not found with id: " + id));
        uploadService.deleteFile(image.getImageUrl());
        hotelImageRepository.delete(image);
    }

    private HotelImageResponse toResponse(HotelImage image) {
        return new HotelImageResponse(image.getId(), image.getImageUrl(), image.getCaption());
    }
}
