package com.companion.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "habits")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HabitEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String description;

    @Builder.Default
    private String category = "HEALTH"; // HEALTH, STUDY, PRODUCTIVITY, MINDFULNESS

    @Builder.Default
    private Integer targetFrequencyPerWeek = 7;

    @Builder.Default
    private Integer currentStreak = 0;

    @Builder.Default
    private Integer bestStreak = 0;

    private LocalDateTime lastCompletedAt;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
