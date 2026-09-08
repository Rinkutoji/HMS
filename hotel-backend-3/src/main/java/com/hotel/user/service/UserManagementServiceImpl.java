package com.hotel.user.service;

import com.hotel.exception.ResourceNotFoundException;
import com.hotel.exception.ValidationException;
import com.hotel.response.PageResponse;
import com.hotel.user.dto.CreateStaffRequest;
import com.hotel.user.dto.UserDTO;
import com.hotel.user.entity.Role;
import com.hotel.user.entity.RoleName;
import com.hotel.user.entity.User;
import com.hotel.user.repository.RoleRepository;
import com.hotel.user.repository.UserRepository;
import com.hotel.user.repository.UserSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserManagementServiceImpl implements UserManagementService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public PageResponse<UserDTO> listByRole(RoleName role, String keyword, Pageable pageable) {
        Specification<User> spec = Specification
                .where(UserSpecification.hasRole(role))
                .and(UserSpecification.keyword(keyword));
        Page<User> page = userRepository.findAll(spec, pageable);
        return PageResponse.from(page.map(this::toDTO));
    }

    @Override
    @Transactional
    public UserDTO createStaff(CreateStaffRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ValidationException("Email is already registered");
        }
        Role staffRole = roleRepository.findByName(RoleName.STAFF)
                .orElseThrow(() -> new IllegalStateException("STAFF role is not seeded"));

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setRole(staffRole);
        user.setActive(true);

        return toDTO(userRepository.save(user));
    }

    @Override
    @Transactional
    public UserDTO setActive(Long userId, boolean active) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        user.setActive(active);
        return toDTO(userRepository.save(user));
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
