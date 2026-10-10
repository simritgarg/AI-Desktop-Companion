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

    private Long userId;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String category; // e.g. "IT & Dev", "SSC CGL", "General" or custom category

    @Column(nullable = false)
    private String goalType; // LONG_TERM, MEDIUM_TERM, SHORT_TERM

    private LocalDate targetDate;
    
    private LocalDateTime deadline; // Full deadline with date and time

    @Builder.Default
    private String status = "IN_PROGRESS"; // IN_PROGRESS, COMPLETED, CANCELLED

    private Long parentGoalId;

    @Builder.Default
    private Integer progressPercentage = 0;

    @Builder.Default
    private Boolean isDeleted = false;

    private LocalDateTime deletedAt;

    private LocalDateTime completedAt;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.isDeleted == null) this.isDeleted = false;
        if (this.progressPercentage == null) this.progressPercentage = 0;
    }
}
