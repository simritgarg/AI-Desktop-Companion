package com.companion.controller;

import com.companion.entity.TaskEntity;
import com.companion.repository.TaskRepository;
import com.companion.util.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @GetMapping
    public ResponseEntity<List<TaskEntity>> getAllTasks() {
        Long userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(taskRepository.findByUserIdAndIsDeletedFalse(userId));
    }

    @GetMapping("/goal/{goalId}")
    public ResponseEntity<List<TaskEntity>> getTasksByGoal(@PathVariable Long goalId) {
        Long userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(taskRepository.findByUserIdAndGoalIdAndIsDeletedFalse(userId, goalId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskEntity> getTaskById(@PathVariable Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        return taskRepository.findById(id)
                .filter(t -> t.getUserId().equals(userId) && !Boolean.TRUE.equals(t.getIsDeleted()))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<TaskEntity> createTask(@RequestBody TaskEntity task) {
        Long userId = SecurityUtils.getCurrentUserId();
        task.setUserId(userId);
        if (task.getStatus() == null) task.setStatus("TODO");
        if (task.getPriority() == null) task.setPriority("MEDIUM");
        if (task.getIsDeleted() == null) task.setIsDeleted(false);
        return ResponseEntity.ok(taskRepository.save(task));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskEntity> updateTask(@PathVariable Long id, @RequestBody TaskEntity taskDetails) {
        Long userId = SecurityUtils.getCurrentUserId();
        return taskRepository.findById(id)
                .filter(t -> t.getUserId().equals(userId))
                .map(task -> {
                    if (taskDetails.getTitle() != null) task.setTitle(taskDetails.getTitle());
                    if (taskDetails.getDescription() != null) task.setDescription(taskDetails.getDescription());
                    if (taskDetails.getPriority() != null) task.setPriority(taskDetails.getPriority());
                    if (taskDetails.getEstimatedMinutes() != null) task.setEstimatedMinutes(taskDetails.getEstimatedMinutes());
                    if (taskDetails.getActualMinutes() != null) task.setActualMinutes(taskDetails.getActualMinutes());
                    if (taskDetails.getStatus() != null) {
                        task.setStatus(taskDetails.getStatus());
                        if ("COMPLETED".equalsIgnoreCase(taskDetails.getStatus()) && task.getCompletedAt() == null) {
                            task.setCompletedAt(LocalDateTime.now());
                        }
                    }
                    if (taskDetails.getDueDate() != null) task.setDueDate(taskDetails.getDueDate());
                    if (taskDetails.getStartTime() != null) task.setStartTime(taskDetails.getStartTime());
                    if (taskDetails.getEndTime() != null) task.setEndTime(taskDetails.getEndTime());
                    if (taskDetails.getGoalId() != null) task.setGoalId(taskDetails.getGoalId());
                    if (taskDetails.getIsTopPriority() != null) task.setIsTopPriority(taskDetails.getIsTopPriority());
                    if (taskDetails.getIsGoalTaskOnly() != null) task.setIsGoalTaskOnly(taskDetails.getIsGoalTaskOnly());

                    return ResponseEntity.ok(taskRepository.save(task));
                }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        return taskRepository.findById(id)
                .filter(t -> t.getUserId().equals(userId))
                .map(task -> {
                    task.setIsDeleted(true);
                    task.setDeletedAt(LocalDateTime.now());
                    taskRepository.save(task);
                    return ResponseEntity.ok().<Void>build();
                }).orElse(ResponseEntity.notFound().build());
    }
}
