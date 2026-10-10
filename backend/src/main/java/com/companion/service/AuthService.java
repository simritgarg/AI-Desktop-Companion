package com.companion.service;

import com.companion.config.JwtUtil;
import com.companion.dto.AuthResponse;
import com.companion.dto.LoginRequest;
import com.companion.dto.RegisterRequest;
import com.companion.entity.UserEntity;
import com.companion.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            return AuthResponse.builder()
                    .message("An account with this email already exists. Please sign in instead.")
                    .build();
        }

        // Create username from email (part before @)
        String username = request.getEmail().split("@")[0] + "_" + System.currentTimeMillis();

        UserEntity user = UserEntity.builder()
                .username(username)
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .primaryTarget(request.getPrimaryTarget() != null ? request.getPrimaryTarget() : "General Goal")
                .xp(0)
                .level(1)
                .streakDays(0)
                .build();

        // Set the name as companionName context (username field stores display name)
        user.setUsername(request.getName() != null ? request.getName() : username);

        // Ensure unique username
        if (userRepository.existsByUsername(user.getUsername())) {
            user.setUsername(user.getUsername() + "_" + System.currentTimeMillis());
        }

        UserEntity savedUser = userRepository.save(user);
        String token = jwtUtil.generateToken(savedUser.getId(), savedUser.getEmail());

        return buildAuthResponse(savedUser, token, "Registration successful! Welcome aboard.");
    }

    public AuthResponse login(LoginRequest request) {
        // Find user by email
        UserEntity user = userRepository.findByEmail(request.getEmail()).orElse(null);

        if (user == null) {
            return AuthResponse.builder()
                    .message("No account found with this email. Please register first.")
                    .build();
        }

        // Validate password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return AuthResponse.builder()
                    .message("Wrong password. Please try again.")
                    .build();
        }

        // Update last active
        user.setLastActiveAt(LocalDateTime.now());
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getId(), user.getEmail());
        return buildAuthResponse(user, token, "Welcome back! Resuming your progress.");
    }

    public AuthResponse getProfile(Long userId) {
        UserEntity user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return AuthResponse.builder()
                    .message("User not found.")
                    .build();
        }
        return buildAuthResponse(user, null, null);
    }

    public UserEntity updateProfile(Long userId, String name, String primaryTarget, String accountabilityMode) {
        UserEntity user = userRepository.findById(userId).orElse(null);
        if (user == null) return null;

        if (name != null) user.setUsername(name);
        if (primaryTarget != null) user.setPrimaryTarget(primaryTarget);
        if (accountabilityMode != null) user.setAccountabilityMode(accountabilityMode);
        user.setLastActiveAt(LocalDateTime.now());

        return userRepository.save(user);
    }

    private AuthResponse buildAuthResponse(UserEntity user, String token, String message) {
        return AuthResponse.builder()
                .userId(user.getId())
                .name(user.getUsername())
                .email(user.getEmail())
                .primaryTarget(user.getPrimaryTarget())
                .token(token)
                .xp(user.getXp())
                .level(user.getLevel())
                .streakDays(user.getStreakDays())
                .companionName(user.getCompanionName())
                .accountabilityMode(user.getAccountabilityMode())
                .message(message)
                .build();
    }
}
