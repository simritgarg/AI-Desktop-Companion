package com.companion.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "diary_entries")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DiaryEntryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @Builder.Default
    private LocalDate entryDate = LocalDate.now();

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Builder.Default
    private String mood = "FOCUSED"; // HAPPY, CALM, FOCUSED, TIRED, ANXIOUS, MOTIVATED

    @Column(columnDefinition = "TEXT")
    private String highlights;

    @Column(columnDefinition = "TEXT")
    private String whatILearned;

    @Column(columnDefinition = "TEXT")
    private String whatWentWell;

    @Column(columnDefinition = "TEXT")
    private String struggles;

    @Column(columnDefinition = "TEXT")
    private String lessonsFromMocks;

    @Column(columnDefinition = "TEXT")
    private String tomorrowIntention;

    @Builder.Default
    private Boolean isFavorite = false;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        if (this.entryDate == null) this.entryDate = LocalDate.now();
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
