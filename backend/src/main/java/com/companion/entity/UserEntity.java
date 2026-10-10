package com.companion.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "app_users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Builder.Default
    private String primaryTarget = "General Goal";

    @Builder.Default
    private String accountabilityMode = "BALANCED"; // FRIENDLY, BALANCED, STRICT, NO_EXCUSES

    @Builder.Default
    private String personality = "BEST_FRIEND"; // BEST_FRIEND, COACH, STUDY_BUDDY, STRICT_MENTOR

    @Builder.Default
    private String companionName = "Aira";

    @Builder.Default
    private Integer xp = 0;

    @Builder.Default
    private Integer level = 1;

    @Builder.Default
    private Integer streakDays = 0;

    private LocalDateTime lastActiveAt;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.lastActiveAt = LocalDateTime.now();
    }
}
