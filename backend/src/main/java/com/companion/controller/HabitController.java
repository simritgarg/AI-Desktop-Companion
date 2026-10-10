package com.companion.controller;

import com.companion.entity.HabitCompletionEntity;
import com.companion.entity.HabitEntity;
import com.companion.repository.HabitCompletionRepository;
import com.companion.repository.HabitRepository;
import com.companion.util.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@RestController
@RequestMapping("/api/habits")
@CrossOrigin(origins = "*")
public class HabitController {

    @Autowired
    private HabitRepository habitRepository;

    @Autowired
    private HabitCompletionRepository habitCompletionRepository;

    @GetMapping
    public ResponseEntity<List<HabitEntity>> getHabits() {
        Long userId = SecurityUtils.getCurrentUserId();
        List<HabitEntity> habits = habitRepository.findByUserIdAndIsDeletedFalse(userId);

        // Calculate and auto-reset streaks if missed a day (>48 hours since last completion)
        LocalDateTime now = LocalDateTime.now();
        for (HabitEntity habit : habits) {
            if (habit.getLastCompletedAt() != null) {
                long daysDiff = ChronoUnit.DAYS.between(habit.getLastCompletedAt().toLocalDate(), now.toLocalDate());
                if (daysDiff > 1) {
                    // Missed a day -> reset current streak to 0
                    habit.setCurrentStreak(0);
                    habitRepository.save(habit);
                }
            }
        }
        return ResponseEntity.ok(habits);
    }

    @PostMapping
    public ResponseEntity<HabitEntity> createHabit(@RequestBody HabitEntity habit) {
        Long userId = SecurityUtils.getCurrentUserId();
        habit.setUserId(userId);
        if (habit.getCategory() == null) habit.setCategory("HEALTH");
        if (habit.getCurrentStreak() == null) habit.setCurrentStreak(0);
        if (habit.getBestStreak() == null) habit.setBestStreak(0);
        if (habit.getIsDeleted() == null) habit.setIsDeleted(false);
        return ResponseEntity.ok(habitRepository.save(habit));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HabitEntity> updateHabit(@PathVariable Long id, @RequestBody HabitEntity details) {
        Long userId = SecurityUtils.getCurrentUserId();
        return habitRepository.findById(id)
                .filter(h -> h.getUserId().equals(userId))
                .map(habit -> {
                    if (details.getTitle() != null) habit.setTitle(details.getTitle());
                    if (details.getDescription() != null) habit.setDescription(details.getDescription());
                    if (details.getCategory() != null) habit.setCategory(details.getCategory());
                    if (details.getTargetFrequencyPerWeek() != null) habit.setTargetFrequencyPerWeek(details.getTargetFrequencyPerWeek());
                    if (details.getCurrentStreak() != null) habit.setCurrentStreak(details.getCurrentStreak());
                    return ResponseEntity.ok(habitRepository.save(habit));
                }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHabit(@PathVariable Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        return habitRepository.findById(id)
                .filter(h -> h.getUserId().equals(userId))
                .map(habit -> {
                    habit.setIsDeleted(true);
                    habit.setDeletedAt(LocalDateTime.now());
                    habitRepository.save(habit);
                    return ResponseEntity.noContent().<Void>build();
                }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/log")
    public ResponseEntity<HabitEntity> logCompletion(@PathVariable Long id, @RequestParam(required = false) String notes) {
        Long userId = SecurityUtils.getCurrentUserId();
        return habitRepository.findById(id)
                .filter(h -> h.getUserId().equals(userId))
                .map(habit -> {
                    LocalDateTime now = LocalDateTime.now();
                    if (habit.getLastCompletedAt() != null) {
                        long daysDiff = ChronoUnit.DAYS.between(habit.getLastCompletedAt().toLocalDate(), now.toLocalDate());
                        if (daysDiff == 1) {
                            habit.setCurrentStreak(habit.getCurrentStreak() + 1);
                        } else if (daysDiff > 1) {
                            habit.setCurrentStreak(1); // Restart streak from 1
                        }
                    } else {
                        habit.setCurrentStreak(1);
                    }

                    habit.setLastCompletedAt(now);
                    if (habit.getCurrentStreak() > habit.getBestStreak()) {
                        habit.setBestStreak(habit.getCurrentStreak());
                    }

                    HabitCompletionEntity completion = HabitCompletionEntity.builder()
                            .habitId(id)
                            .notes(notes)
                            .completedAt(now)
                            .build();
                    habitCompletionRepository.save(completion);

                    return ResponseEntity.ok(habitRepository.save(habit));
                }).orElse(ResponseEntity.notFound().build());
    }
}
