package com.companion.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reminders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReminderEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Builder.Default
    private String reminderType = "TIME_BASED"; // TIME_BASED, RECURRING, HABIT, CONTEXT_AWARE, GOAL_BASED

    private LocalDateTime scheduledAt;

    private String recurrenceCron; // e.g. "EVERY_15_MINUTES", "EVERY_HOUR", "DAILY_10AM"

    @Builder.Default
    private String animationType = "DRINKING"; // DRINKING, STUDYING, STRETCHING, CELEBRATING, GREETING, TALKING

    @Builder.Default
    private Integer snoozeCount = 0;

    private LocalDateTime lastTriggeredAt;

    @Builder.Default
    private Boolean isActive = true;

    @Builder.Default
    private String priority = "MEDIUM";

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
