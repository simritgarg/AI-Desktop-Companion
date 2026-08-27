package com.companion.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "goals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GoalEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String goalType; // LONG_TERM, MEDIUM_TERM, SHORT_TERM

    private LocalDate targetDate;

    @Builder.Default
    private String status = "IN_PROGRESS"; // IN_PROGRESS, COMPLETED, CANCELLED

    private Long parentGoalId;

    @Builder.Default
    private Integer progressPercentage = 0;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
