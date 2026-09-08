package com.hotel.user.service;

import com.hotel.user.dto.UpdateProfileRequest;
import com.hotel.user.dto.UserDTO;

public interface UserService {
    UserDTO getProfile(String email);
    UserDTO updateProfile(String email, UpdateProfileRequest request);
}
