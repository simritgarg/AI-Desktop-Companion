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

    private Long userId;

    @Column(nullable = false)
    private String title;

    @Builder.Default
    private String category = "GENERAL"; // Workspace section name or subject

    private String subject; // Custom subject added by user

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(columnDefinition = "TEXT")
    private String checklistJson; // JSON array of items: [{ "id": "1", "text": "Task", "checked": false }]

    @Builder.Default
    private Boolean isChecklist = false;

    @Builder.Default
    private String color = "#1F2937"; // Google Keep style background color hex

    private String tags;

    @Builder.Default
    private Boolean isPinned = false;

    @Builder.Default
    private Boolean isDeleted = false;

    private LocalDateTime deletedAt;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.isDeleted == null) this.isDeleted = false;
        if (this.isPinned == null) this.isPinned = false;
        if (this.isChecklist == null) this.isChecklist = false;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
