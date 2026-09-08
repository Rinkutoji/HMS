package com.hotel.user.service;

import com.hotel.response.PageResponse;
import com.hotel.user.dto.CreateStaffRequest;
import com.hotel.user.dto.UserDTO;
import com.hotel.user.entity.RoleName;
import org.springframework.data.domain.Pageable;

public interface UserManagementService {
    PageResponse<UserDTO> listByRole(RoleName role, String keyword, Pageable pageable);
    UserDTO createStaff(CreateStaffRequest request);
    UserDTO setActive(Long userId, boolean active);
}
