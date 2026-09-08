package com.hotel.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

class JwtTokenProviderTest {
    private JwtTokenProvider provider;

    @BeforeEach
    void setUp() {
        provider = new JwtTokenProvider();
        ReflectionTestUtils.setField(provider, "jwtSecret", "a-very-long-secret-key-for-jwt-tests-1234567890");
        ReflectionTestUtils.setField(provider, "jwtExpirationMs", 60_000L);
    }

    @Test
    void generatedTokenContainsEmailAndRole() {
        String token = provider.generateToken("user@example.com", "CUSTOMER", 42L);
        assertEquals("user@example.com", provider.getEmailFromToken(token));
        assertEquals("CUSTOMER", provider.getRoleFromToken(token));
        assertTrue(provider.validateToken(token));
    }

    @Test
    void invalidOrTamperedTokenIsRejected() {
        String token = provider.generateToken("user@example.com", "CUSTOMER", 42L);
        assertFalse(provider.validateToken(token + "tampered"));
        assertFalse(provider.validateToken("not-a-jwt"));
    }
}
