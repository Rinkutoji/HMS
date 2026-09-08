package com.hotel.user.service;

import com.hotel.exception.ResourceNotFoundException;
import com.hotel.user.dto.UpdateProfileRequest;
import com.hotel.user.dto.UserDTO;
import com.hotel.user.entity.User;
import com.hotel.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public UserDTO getProfile(String email) {
        return toDTO(findByEmail(email));
    }

    @Override
    @Transactional
    public UserDTO updateProfile(String email, UpdateProfileRequest request) {
        User user = findByEmail(email);
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());
        return toDTO(userRepository.save(user));
    }

    private User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private UserDTO toDTO(User user) {
        return new UserDTO(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole().getName().name(),
                user.isActive()
        );
    }
}
