package com.hotel.config;

import com.hotel.user.entity.Role;
import com.hotel.user.entity.RoleName;
import com.hotel.user.entity.User;
import com.hotel.user.repository.RoleRepository;
import com.hotel.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Seeds the 3 fixed roles and a default ADMIN account on startup.
 * Staff/Admin accounts are "login only" (no self-registration), so a
 * bootstrap admin is required to be able to log in and create staff
 * accounts via the future Admin > Manage Staff module.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private static final String DEFAULT_ADMIN_EMAIL = "admin@hotel.com";
    private static final String DEFAULT_ADMIN_PASSWORD = "Admin@123";

    @Override
    public void run(String... args) {
        seedRole(RoleName.CUSTOMER);
        seedRole(RoleName.STAFF);
        Role adminRole = seedRole(RoleName.ADMIN);

        if (!userRepository.existsByEmail(DEFAULT_ADMIN_EMAIL)) {
            User admin = new User();
            admin.setFirstName("System");
            admin.setLastName("Admin");
            admin.setEmail(DEFAULT_ADMIN_EMAIL);
            admin.setPassword(passwordEncoder.encode(DEFAULT_ADMIN_PASSWORD));
            admin.setRole(adminRole);
            admin.setActive(true);
            userRepository.save(admin);
            log.info("Seeded default admin account -> email: {} / password: {}", DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD);
        }
    }

    private Role seedRole(RoleName name) {
        return roleRepository.findByName(name)
                .orElseGet(() -> roleRepository.save(new Role(null, name)));
    }
}
