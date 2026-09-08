package com.hotel.auth.staffadmin;

import com.hotel.auth.dto.AuthResponse;
import com.hotel.auth.staffadmin.dto.StaffLoginRequest;
import com.hotel.security.JwtTokenProvider;
import com.hotel.user.entity.RoleName;
import com.hotel.user.entity.User;
import com.hotel.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StaffAdminAuthService {

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    public AuthResponse login(StaffLoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        RoleName role = user.getRole().getName();
        if (role != RoleName.STAFF && role != RoleName.ADMIN) {
            throw new BadCredentialsException("Invalid email or password");
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        String token = jwtTokenProvider.generateToken(user.getEmail(), "ROLE_" + role.name(), user.getId());
        return new AuthResponse(token, user.getId(), user.getFirstName(), user.getLastName(), user.getEmail(), role.name());
    }
}
