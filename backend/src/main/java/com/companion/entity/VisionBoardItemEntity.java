package com.companion.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "vision_board_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VisionBoardItemEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long boardId;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String imageUrlOrData;

    @Column(columnDefinition = "TEXT")
    private String caption;

    private String externalLink;

    @Builder.Default
    private String itemType = "IMAGE"; // IMAGE, QUOTE, LINK, MILESTONE

    @Builder.Default
    private Integer displayOrder = 0;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
