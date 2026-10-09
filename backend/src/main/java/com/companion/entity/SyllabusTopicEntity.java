package com.companion.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "syllabus_topics")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SyllabusTopicEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @Builder.Default
    private String category = "SSC_CGL"; // SSC_CGL, IT_CAREER

    @Column(nullable = false)
    private String subject; // QUANTITATIVE_APTITUDE, REASONING, ENGLISH, GENERAL_AWARENESS, JAVA, WEB_DEV, DSA

    @Column(nullable = false)
    private String topicName;

    private String subtopicName;

    @Builder.Default
    private String status = "NOT_STARTED"; // NOT_STARTED, LEARNING, COMPLETED, REVISION_REQUIRED

    @Builder.Default
    private String priority = "MEDIUM"; // LOW, MEDIUM, HIGH, URGENT

    @Builder.Default
    private String difficulty = "MODERATE"; // EASY, MODERATE, HARD

    private LocalDate targetCompletionDate;

    @Builder.Default
    private Integer estimatedStudyTimeMinutes = 60;

    @Builder.Default
    private Integer actualStudyTimeMinutes = 0;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(columnDefinition = "TEXT")
    private String formulaOrShortcuts;

    @Builder.Default
    private Integer questionsPracticedCount = 0;

    @Builder.Default
    private Double accuracyPercentage = 0.0;

    @Builder.Default
    private Integer revisionCount = 0;

    private LocalDate nextRevisionDate;

    @Builder.Default
    private Integer confidenceLevel = 50; // 0 to 100

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
