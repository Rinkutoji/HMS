package com.hotel.security;

import com.hotel.user.entity.Role;
import com.hotel.user.entity.RoleName;
import com.hotel.user.entity.User;
import com.hotel.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CustomUserDetailsServiceTest {
    @Mock UserRepository userRepository;
    @InjectMocks CustomUserDetailsService service;

    @Test
    void mapsUserToSpringAuthoritiesAndDisabledState() {
        User user = new User(); user.setEmail("staff@example.com"); user.setPassword("hash"); user.setActive(false);
        user.setRole(new Role(1L, RoleName.STAFF));
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        var details = service.loadUserByUsername(user.getEmail());
        assertEquals("staff@example.com", details.getUsername());
        assertEquals("hash", details.getPassword());
        assertFalse(details.isEnabled());
        assertTrue(details.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_STAFF")));
    }

    @Test
    void missingUserRaisesUsernameNotFound() {
        when(userRepository.findByEmail("missing@example.com")).thenReturn(Optional.empty());
        assertThrows(UsernameNotFoundException.class, () -> service.loadUserByUsername("missing@example.com"));
    }
}
