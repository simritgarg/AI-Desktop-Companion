package com.companion.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "focus_sessions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FocusSessionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Builder.Default
    private String sessionType = "POMODORO"; // POMODORO, DEEP_WORK, CUSTOM

    @Column(nullable = false)
    private Integer targetDurationMinutes;

    @Builder.Default
    private Integer actualFocusMinutes = 0;

    @Builder.Default
    private Integer distractionCount = 0;

    @Builder.Default
    private String status = "IN_PROGRESS"; // IN_PROGRESS, COMPLETED, INTERRUPTED, CANCELLED

    private LocalDateTime startedAt;

    private LocalDateTime endedAt;

    private Long taskId;

    @PrePersist
    protected void onCreate() {
        if (this.startedAt == null) {
            this.startedAt = LocalDateTime.now();
        }
    }
}
