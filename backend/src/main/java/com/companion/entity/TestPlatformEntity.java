package com.companion.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "test_platforms")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TestPlatformEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String platformName; // Oliveboard, Testbook, Adda247, Custom

    private String websiteUrl;

    private String testSeriesName;

    @Builder.Default
    private String examCategory = "SSC_CGL"; // SSC_CGL, IT_TECHNICAL

    @Builder.Default
    private String importMethod = "MANUAL"; // OFFICIAL_API, CSV_EXCEL, PDF_REPORT, SCREENSHOT_OCR, MANUAL

    @Builder.Default
    private String integrationStatus = "ACTIVE"; // ACTIVE, MANUAL_ONLY, CONNECTED, PENDING

    private LocalDateTime lastImportedAt;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
