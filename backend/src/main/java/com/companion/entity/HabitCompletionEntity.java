package com.companion.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "habit_completions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HabitCompletionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long habitId;

    private LocalDateTime completedAt;

    private String notes;

    @PrePersist
    protected void onCreate() {
        if (this.completedAt == null) {
            this.completedAt = LocalDateTime.now();
        }
    }
}
