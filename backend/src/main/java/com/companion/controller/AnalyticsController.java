package com.companion.controller;

import com.companion.entity.DailyStatisticsEntity;
import com.companion.repository.DailyStatisticsRepository;
import com.companion.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {

    @Autowired
    private DailyStatisticsRepository dailyStatisticsRepository;

    @Autowired
    private TaskRepository taskRepository;

    @GetMapping("/today")
    public ResponseEntity<DailyStatisticsEntity> getTodayStats() {
        LocalDate today = LocalDate.now();
        Optional<DailyStatisticsEntity> existing = dailyStatisticsRepository.findByDate(today);
        
        if (existing.isPresent()) {
            return ResponseEntity.ok(existing.get());
        }

        DailyStatisticsEntity initial = DailyStatisticsEntity.builder()
                .date(today)
                .totalActiveMinutes(120)
                .totalFocusMinutes(75)
                .distractedMinutes(15)
                .focusSessionsCompleted(3)
                .tasksCompleted(taskRepository.findByStatus("COMPLETED").size())
                .tasksSkipped(0)
                .waterIntakeCount(4)
                .habitCompletionRate(80)
                .build();

        return ResponseEntity.ok(dailyStatisticsRepository.save(initial));
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSummary() {
        return ResponseEntity.ok(Map.of(
                "totalTasksCompleted", taskRepository.findByStatus("COMPLETED").size(),
                "pendingTasks", taskRepository.findByStatus("TODO").size(),
                "currentStreakDays", 7,
                "userLevel", 3,
                "userXp", 450
        ));
    }
}
