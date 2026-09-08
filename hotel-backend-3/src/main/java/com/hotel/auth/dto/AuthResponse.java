package com.hotel.auth.dto;

import lombok.Getter;

@Getter
public class AuthResponse {
    private final String token;
    private final String tokenType = "Bearer";
    private final Long userId;
    private final String firstName;
    private final String lastName;
    private final String email;
    private final String role;

    public AuthResponse(String token, Long userId, String firstName, String lastName, String email, String role) {
        this.token = token;
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.role = role;
    }
}
