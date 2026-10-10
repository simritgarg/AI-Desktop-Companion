package com.companion.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private Long userId;
    private String name;
    private String email;
    private String primaryTarget;
    private String token;
    private Integer xp;
    private Integer level;
    private Integer streakDays;
    private String companionName;
    private String accountabilityMode;
    private String message;
}
