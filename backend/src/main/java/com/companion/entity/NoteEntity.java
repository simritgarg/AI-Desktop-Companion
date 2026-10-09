package com.companion.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notes_knowledge_base")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NoteEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Builder.Default
    private String category = "SSC_CGL"; // SSC_CGL, IT_CAREER, FORMULAS, VOCABULARY, SYSTEM_DESIGN

    private String subject;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    private String tags;

    @Builder.Default
    private Boolean isPinned = false;

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
