package com.companion.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "vision_boards")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VisionBoardEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String boardName;

    @Builder.Default
    private String category = "SSC_CGL"; // SSC_CGL, CAREER, LIFESTYLE, ASPIRATIONS

    @Column(columnDefinition = "TEXT")
    private String description;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
