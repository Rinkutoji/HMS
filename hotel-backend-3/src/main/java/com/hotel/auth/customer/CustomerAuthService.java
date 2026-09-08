package com.hotel.auth.customer;

import com.hotel.auth.customer.dto.LoginRequest;
import com.hotel.auth.customer.dto.RegisterRequest;
import com.hotel.auth.dto.AuthResponse;
import com.hotel.exception.ValidationException;
import com.hotel.security.JwtTokenProvider;
import com.hotel.user.entity.Role;
import com.hotel.user.entity.RoleName;
import com.hotel.user.entity.User;
import com.hotel.user.repository.RoleRepository;
import com.hotel.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CustomerAuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ValidationException("Email is already registered");
        }

        Role customerRole = roleRepository.findByName(RoleName.CUSTOMER)
                .orElseThrow(() -> new IllegalStateException("CUSTOMER role is not seeded"));

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setRole(customerRole);
        user.setActive(true);

        User saved = userRepository.save(user);

        String token = jwtTokenProvider.generateToken(saved.getEmail(), "ROLE_CUSTOMER", saved.getId());
        return new AuthResponse(token, saved.getId(), saved.getFirstName(), saved.getLastName(), saved.getEmail(), "CUSTOMER");
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (user.getRole().getName() != RoleName.CUSTOMER) {
            throw new BadCredentialsException("Invalid email or password");
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        String token = jwtTokenProvider.generateToken(user.getEmail(), "ROLE_CUSTOMER", user.getId());
        return new AuthResponse(token, user.getId(), user.getFirstName(), user.getLastName(), user.getEmail(), "CUSTOMER");
    }
}
