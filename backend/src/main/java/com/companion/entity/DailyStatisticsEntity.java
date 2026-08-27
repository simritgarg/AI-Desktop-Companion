package com.companion.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "daily_statistics")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyStatisticsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private LocalDate date;

    @Builder.Default
    private Integer totalActiveMinutes = 0;

    @Builder.Default
    private Integer totalFocusMinutes = 0;

    @Builder.Default
    private Integer distractedMinutes = 0;

    @Builder.Default
    private Integer focusSessionsCompleted = 0;

    @Builder.Default
    private Integer tasksCompleted = 0;

    @Builder.Default
    private Integer tasksSkipped = 0;

    @Builder.Default
    private Integer waterIntakeCount = 0;

    @Builder.Default
    private Integer habitCompletionRate = 0;
}
