package com.companion.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ai_memories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AIMemoryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String memoryKey;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String memoryValue;

    @Builder.Default
    private String category = "GENERAL"; // PREFERENCE, HABIT, GOAL, ROUTINE, BEHAVIORAL

    @Builder.Default
    private Double importanceScore = 1.0;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
