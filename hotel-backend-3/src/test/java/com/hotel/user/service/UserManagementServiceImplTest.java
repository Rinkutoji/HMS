package com.hotel.user.service;

import com.hotel.exception.ValidationException;
import com.hotel.user.dto.CreateStaffRequest;
import com.hotel.user.entity.Role;
import com.hotel.user.entity.RoleName;
import com.hotel.user.entity.User;
import com.hotel.user.repository.RoleRepository;
import com.hotel.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserManagementServiceImplTest {
    @Mock UserRepository userRepository;
    @Mock RoleRepository roleRepository;
    @Mock PasswordEncoder passwordEncoder;
    @InjectMocks UserManagementServiceImpl service;

    @Test
    void createStaffEncodesPasswordAndAssignsStaffRole() {
        CreateStaffRequest request = new CreateStaffRequest(); request.setFirstName("New"); request.setLastName("Staff");
        request.setEmail("staff@example.com"); request.setPassword("plain"); request.setPhone("123");
        Role role = new Role(2L, RoleName.STAFF);
        when(userRepository.existsByEmail(request.getEmail())).thenReturn(false);
        when(roleRepository.findByName(RoleName.STAFF)).thenReturn(Optional.of(role));
        when(passwordEncoder.encode("plain")).thenReturn("encoded");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> { User u = inv.getArgument(0); u.setId(9L); return u; });
        var dto = service.createStaff(request);
        assertEquals(9L, dto.getId()); assertEquals("STAFF", dto.getRole()); assertTrue(dto.isActive());
        verify(passwordEncoder).encode("plain");
    }

    @Test
    void createStaffRejectsExistingEmail() {
        CreateStaffRequest request = new CreateStaffRequest(); request.setEmail("exists@example.com");
        when(userRepository.existsByEmail(request.getEmail())).thenReturn(true);
        assertThrows(ValidationException.class, () -> service.createStaff(request));
        verifyNoInteractions(roleRepository);
    }
}
