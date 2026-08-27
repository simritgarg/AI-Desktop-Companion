package com.companion.controller;

import com.companion.entity.HabitCompletionEntity;
import com.companion.entity.HabitEntity;
import com.companion.repository.HabitCompletionRepository;
import com.companion.repository.HabitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
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
        return ResponseEntity.ok(habitRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<HabitEntity> createHabit(@RequestBody HabitEntity habit) {
        if (habit.getCategory() == null) habit.setCategory("HEALTH");
        return ResponseEntity.ok(habitRepository.save(habit));
    }

    @PostMapping("/{id}/log")
    public ResponseEntity<HabitEntity> logCompletion(@PathVariable Long id, @RequestParam(required = false) String notes) {
        return habitRepository.findById(id).map(habit -> {
            habit.setLastCompletedAt(LocalDateTime.now());
            habit.setCurrentStreak(habit.getCurrentStreak() + 1);
            if (habit.getCurrentStreak() > habit.getBestStreak()) {
                habit.setBestStreak(habit.getCurrentStreak());
            }

            HabitCompletionEntity completion = HabitCompletionEntity.builder()
                    .habitId(id)
                    .notes(notes)
                    .completedAt(LocalDateTime.now())
                    .build();
            habitCompletionRepository.save(completion);

            return ResponseEntity.ok(habitRepository.save(habit));
        }).orElse(ResponseEntity.notFound().build());
    }
}
