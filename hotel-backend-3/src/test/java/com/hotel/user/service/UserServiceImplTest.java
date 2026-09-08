package com.hotel.user.service;

import com.hotel.exception.ResourceNotFoundException;
import com.hotel.user.entity.Role;
import com.hotel.user.entity.RoleName;
import com.hotel.user.entity.User;
import com.hotel.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {
    @Mock UserRepository userRepository;
    @InjectMocks UserServiceImpl service;

    @Test
    void updateProfileChangesEditableFields() {
        User user = user();
        var request = new com.hotel.user.dto.UpdateProfileRequest();
        request.setFirstName("Updated"); request.setLastName("Name"); request.setPhone("999");
        when(userRepository.findByEmail("u@example.com")).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));
        var dto = service.updateProfile("u@example.com", request);
        assertEquals("Updated", dto.getFirstName()); assertEquals("999", dto.getPhone());
    }

    @Test
    void missingProfileRaisesNotFound() {
        when(userRepository.findByEmail("missing@example.com")).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> service.getProfile("missing@example.com"));
    }

    private User user() {
        User u = new User(); u.setId(1L); u.setFirstName("Original"); u.setLastName("User"); u.setEmail("u@example.com"); u.setPhone("111");
        u.setRole(new Role(1L, RoleName.CUSTOMER)); u.setActive(true); return u;
    }
}
