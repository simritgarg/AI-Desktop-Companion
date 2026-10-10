package com.companion.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "mistake_bank")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MistakeRecordEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String questionText;

    @Column(columnDefinition = "TEXT")
    private String optionsJson;

    private String correctAnswer;

    private String userAnswer;

    @Column(columnDefinition = "TEXT")
    private String explanation;

    @Builder.Default
    private String examCategory = "SSC_CGL"; // SSC_CGL, IT_TECHNICAL

    private String platformName; // Oliveboard, Testbook, Adda247, Custom

    private String testName;

    private String subject; // QUANTITATIVE_APTITUDE, REASONING, ENGLISH, GENERAL_AWARENESS

    private String topic;

    @Builder.Default
    private String mistakeCategory = "CONCEPTUAL"; // CONCEPTUAL, CALCULATION, MEMORY, GUESSING, READING, TIME_MANAGEMENT

    @Column(columnDefinition = "TEXT")
    private String personalNotes;

    @Builder.Default
    private String reviewStatus = "UNRESOLVED"; // UNRESOLVED, UNDER_REVIEW, MASTERED

    @Builder.Default
    private Integer reviewCount = 0;

    @Builder.Default
    private Boolean isDeleted = false;

    private LocalDateTime deletedAt;

    private LocalDateTime lastReviewedAt;
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.isDeleted == null) this.isDeleted = false;
    }
}
