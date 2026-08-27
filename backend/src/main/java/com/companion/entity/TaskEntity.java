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

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Builder.Default
    private String priority = "MEDIUM"; // LOW, MEDIUM, HIGH, URGENT

    @Builder.Default
    private Integer estimatedMinutes = 30;

    @Builder.Default
    private Integer actualMinutes = 0;

    @Builder.Default
    private String status = "TODO"; // TODO, IN_PROGRESS, COMPLETED, SKIPPED

    private LocalDateTime dueDate;

    private Long goalId;

    @Builder.Default
    private Boolean isTopPriority = false;

    private LocalDateTime completedAt;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
