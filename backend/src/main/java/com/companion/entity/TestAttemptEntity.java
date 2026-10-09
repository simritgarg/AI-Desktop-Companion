package com.companion.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "test_attempts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TestAttemptEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long platformId;

    @Column(nullable = false)
    private String platformName; // Oliveboard, Testbook, Adda247

    private String testSeriesName;

    @Column(nullable = false)
    private String testName;

    @Builder.Default
    private LocalDateTime attemptDate = LocalDateTime.now();

    @Builder.Default
    private String testType = "FULL_MOCK"; // FULL_MOCK, SECTIONAL, TOPIC_TEST, PYQ

    @Builder.Default
    private Double totalMarks = 200.0;

    @Builder.Default
    private Double marksObtained = 0.0;

    @Builder.Default
    private Integer correctAnswers = 0;

    @Builder.Default
    private Integer incorrectAnswers = 0;

    @Builder.Default
    private Integer unattemptedQuestions = 0;

    @Builder.Default
    private Double negativeMarks = 0.0;

    @Builder.Default
    private Double accuracyPercentage = 0.0;

    @Builder.Default
    private Double attemptRatePercentage = 0.0;

    @Builder.Default
    private Integer timeTakenMinutes = 60;

    private String percentileOrRank;

    @Column(columnDefinition = "TEXT")
    private String subjectScoresJson; // JSON string storing subject-wise breakdown

    @Column(columnDefinition = "TEXT")
    private String topicBreakdownJson; // JSON string storing topic-wise breakdown

    @Column(columnDefinition = "TEXT")
    private String rawImportSource; // Store original CSV row or raw file snippet for verification

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (this.attemptDate == null) {
            this.attemptDate = LocalDateTime.now();
        }
        this.createdAt = LocalDateTime.now();
    }
}
