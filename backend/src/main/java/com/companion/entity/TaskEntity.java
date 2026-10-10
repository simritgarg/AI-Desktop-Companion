package com.companion.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String category; // Custom category tag

    @Builder.Default
    private String priority = "MEDIUM"; // LOW, MEDIUM, HIGH, URGENT

    @Builder.Default
    private Integer estimatedMinutes = 30;

    @Builder.Default
    private Integer actualMinutes = 0;

    @Builder.Default
    private String status = "TODO"; // TODO, IN_PROGRESS, COMPLETED, SKIPPED, IN_DUE

    private LocalDateTime dueDate;

    private String startTime; // e.g. "09:00 AM"

    private String endTime;   // e.g. "10:30 AM"

    private Long goalId;

    @Builder.Default
    private Boolean isTopPriority = false;

    @Builder.Default
    private Boolean isGoalTaskOnly = false; // If true, managed under goal

    @Builder.Default
    private Boolean isDeleted = false;

    private LocalDateTime deletedAt;

    private LocalDateTime completedAt;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.isDeleted == null) this.isDeleted = false;
        if (this.isGoalTaskOnly == null) this.isGoalTaskOnly = false;
    }
}
