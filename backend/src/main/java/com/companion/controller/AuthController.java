package com.companion.controller;

import com.companion.dto.AuthResponse;
import com.companion.dto.LoginRequest;
import com.companion.dto.RegisterRequest;
import com.companion.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            return ResponseEntity.badRequest().body(
                    AuthResponse.builder().message("Email is required.").build()
            );
        }
        if (request.getPassword() == null || request.getPassword().length() < 6) {
            return ResponseEntity.badRequest().body(
                    AuthResponse.builder().message("Password must be at least 6 characters.").build()
            );
        }

        AuthResponse response = authService.register(request);

        // If registration failed (no token), return 409 conflict
        if (response.getToken() == null) {
            return ResponseEntity.status(409).body(response);
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            return ResponseEntity.badRequest().body(
                    AuthResponse.builder().message("Email is required.").build()
            );
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            return ResponseEntity.badRequest().body(
                    AuthResponse.builder().message("Password is required.").build()
            );
        }

        AuthResponse response = authService.login(request);

        // If login failed (no token), return 401
        if (response.getToken() == null) {
            return ResponseEntity.status(401).body(response);
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> getProfile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getPrincipal() == null) {
            return ResponseEntity.status(401).body(
                    AuthResponse.builder().message("Not authenticated.").build()
            );
        }

        Long userId = (Long) auth.getPrincipal();
        AuthResponse profile = authService.getProfile(userId);

        if (profile.getUserId() == null) {
            return ResponseEntity.status(404).body(profile);
        }

        return ResponseEntity.ok(profile);
    }
}
