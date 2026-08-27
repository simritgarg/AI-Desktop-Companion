package com.companion.controller;

import com.companion.entity.TaskEntity;
import com.companion.repository.TaskRepository;
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
        return ResponseEntity.ok(taskRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<TaskEntity> createTask(@RequestBody TaskEntity task) {
        if (task.getStatus() == null) task.setStatus("TODO");
        if (task.getPriority() == null) task.setPriority("MEDIUM");
        return ResponseEntity.ok(taskRepository.save(task));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskEntity> updateTask(@PathVariable Long id, @RequestBody TaskEntity taskDetails) {
        return taskRepository.findById(id).map(task -> {
            task.setTitle(taskDetails.getTitle());
            task.setDescription(taskDetails.getDescription());
            task.setPriority(taskDetails.getPriority());
            task.setEstimatedMinutes(taskDetails.getEstimatedMinutes());
            task.setActualMinutes(taskDetails.getActualMinutes());
            task.setStatus(taskDetails.getStatus());
            task.setGoalId(taskDetails.getGoalId());
            task.setIsTopPriority(taskDetails.getIsTopPriority());

            if ("COMPLETED".equalsIgnoreCase(taskDetails.getStatus()) && task.getCompletedAt() == null) {
                task.setCompletedAt(LocalDateTime.now());
            }

            return ResponseEntity.ok(taskRepository.save(task));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        if (taskRepository.existsById(id)) {
            taskRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
