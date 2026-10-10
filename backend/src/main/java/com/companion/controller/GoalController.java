package com.companion.controller;

import com.companion.entity.GoalEntity;
import com.companion.repository.GoalRepository;
import com.companion.repository.TaskRepository;
import com.companion.util.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/goals")
@CrossOrigin(origins = "*")
public class GoalController {

    @Autowired
    private GoalRepository goalRepository;

    @Autowired
    private TaskRepository taskRepository;

    @GetMapping
    public ResponseEntity<List<GoalEntity>> getAllGoals() {
        Long userId = SecurityUtils.getCurrentUserId();
        List<GoalEntity> goals = goalRepository.findByUserIdAndIsDeletedFalse(userId);

        // Dynamically calculate progress percentage based on nested subtasks if present
        for (GoalEntity goal : goals) {
            var tasks = taskRepository.findByGoalIdAndIsDeletedFalse(goal.getId());
            if (!tasks.isEmpty()) {
                long completed = tasks.stream().filter(t -> "COMPLETED".equalsIgnoreCase(t.getStatus())).count();
                int pct = (int) Math.round(((double) completed / tasks.size()) * 100.0);
                goal.setProgressPercentage(pct);
                if (pct == 100 && !"COMPLETED".equalsIgnoreCase(goal.getStatus())) {
                    goal.setStatus("COMPLETED");
                    goal.setCompletedAt(LocalDateTime.now());
                }
            }
        }
        return ResponseEntity.ok(goals);
    }

    @GetMapping("/{id}")
    public ResponseEntity<GoalEntity> getGoalById(@PathVariable Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        return goalRepository.findById(id)
                .filter(g -> g.getUserId().equals(userId) && !Boolean.TRUE.equals(g.getIsDeleted()))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<GoalEntity> createGoal(@RequestBody GoalEntity goal) {
        Long userId = SecurityUtils.getCurrentUserId();
        goal.setUserId(userId);
        if (goal.getGoalType() == null) goal.setGoalType("SHORT_TERM");
        if (goal.getStatus() == null) goal.setStatus("IN_PROGRESS");
        if (goal.getIsDeleted() == null) goal.setIsDeleted(false);
        return ResponseEntity.ok(goalRepository.save(goal));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GoalEntity> updateGoal(@PathVariable Long id, @RequestBody GoalEntity details) {
        Long userId = SecurityUtils.getCurrentUserId();
        return goalRepository.findById(id)
                .filter(g -> g.getUserId().equals(userId))
                .map(goal -> {
                    if (details.getTitle() != null) goal.setTitle(details.getTitle());
                    if (details.getDescription() != null) goal.setDescription(details.getDescription());
                    if (details.getCategory() != null) goal.setCategory(details.getCategory());
                    if (details.getGoalType() != null) goal.setGoalType(details.getGoalType());
                    if (details.getTargetDate() != null) goal.setTargetDate(details.getTargetDate());
                    if (details.getDeadline() != null) goal.setDeadline(details.getDeadline());
                    if (details.getStatus() != null) {
                        goal.setStatus(details.getStatus());
                        if ("COMPLETED".equalsIgnoreCase(details.getStatus()) && goal.getCompletedAt() == null) {
                            goal.setCompletedAt(LocalDateTime.now());
                        }
                    }
                    if (details.getProgressPercentage() != null) goal.setProgressPercentage(details.getProgressPercentage());
                    return ResponseEntity.ok(goalRepository.save(goal));
                }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGoal(@PathVariable Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        return goalRepository.findById(id)
                .filter(g -> g.getUserId().equals(userId))
                .map(goal -> {
                    goal.setIsDeleted(true);
                    goal.setDeletedAt(LocalDateTime.now());
                    goalRepository.save(goal);

                    // Delete all subtasks associated with this goal
                    var subtasks = taskRepository.findByGoalIdAndIsDeletedFalse(id);
                    for (var st : subtasks) {
                        st.setIsDeleted(true);
                        st.setDeletedAt(LocalDateTime.now());
                        taskRepository.save(st);
                    }

                    return ResponseEntity.ok().<Void>build();
                }).orElse(ResponseEntity.notFound().build());
    }
}
