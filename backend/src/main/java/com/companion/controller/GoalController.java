package com.companion.controller;

import com.companion.entity.GoalEntity;
import com.companion.repository.GoalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
@CrossOrigin(origins = "*")
public class GoalController {

    @Autowired
    private GoalRepository goalRepository;

    @GetMapping
    public ResponseEntity<List<GoalEntity>> getAllGoals() {
        return ResponseEntity.ok(goalRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<GoalEntity> createGoal(@RequestBody GoalEntity goal) {
        if (goal.getGoalType() == null) goal.setGoalType("SHORT_TERM");
        if (goal.getStatus() == null) goal.setStatus("IN_PROGRESS");
        return ResponseEntity.ok(goalRepository.save(goal));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GoalEntity> updateGoal(@PathVariable Long id, @RequestBody GoalEntity details) {
        return goalRepository.findById(id).map(goal -> {
            goal.setTitle(details.getTitle());
            goal.setDescription(details.getDescription());
            goal.setGoalType(details.getGoalType());
            goal.setTargetDate(details.getTargetDate());
            goal.setStatus(details.getStatus());
            goal.setProgressPercentage(details.getProgressPercentage());
            return ResponseEntity.ok(goalRepository.save(goal));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGoal(@PathVariable Long id) {
        if (goalRepository.existsById(id)) {
            goalRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
