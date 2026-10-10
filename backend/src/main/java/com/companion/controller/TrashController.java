package com.companion.controller;

import com.companion.entity.*;
import com.companion.repository.*;
import com.companion.util.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trash")
@CrossOrigin(origins = "*")
public class TrashController {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private GoalRepository goalRepository;

    @Autowired
    private HabitRepository habitRepository;

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private MistakeRepository mistakeRepository;

    @Autowired
    private TestAttemptRepository testAttemptRepository;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getTrashItems() {
        Long userId = SecurityUtils.getCurrentUserId();

        // Perform auto purge for items older than 30 days
        purgeExpiredItems(userId);

        List<TaskEntity> tasks = taskRepository.findByUserIdAndIsDeletedTrue(userId);
        List<GoalEntity> goals = goalRepository.findByUserIdAndIsDeletedTrue(userId);
        List<HabitEntity> habits = habitRepository.findByUserIdAndIsDeletedTrue(userId);
        List<NoteEntity> notes = noteRepository.findByUserIdAndIsDeletedTrue(userId);
        List<MistakeRecordEntity> mistakes = mistakeRepository.findByUserIdAndIsDeletedTrue(userId);
        List<TestAttemptEntity> tests = testAttemptRepository.findByUserIdAndIsDeletedTrue(userId);

        Map<String, Object> response = new HashMap<>();
        response.put("tasks", tasks);
        response.put("goals", goals);
        response.put("habits", habits);
        response.put("notes", notes);
        response.put("mistakes", mistakes);
        response.put("tests", tests);
        response.put("totalCount", tasks.size() + goals.size() + habits.size() + notes.size() + mistakes.size() + tests.size());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/restore/{type}/{id}")
    public ResponseEntity<Map<String, String>> restoreItem(@PathVariable String type, @PathVariable Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        boolean restored = false;

        switch (type.toLowerCase()) {
            case "task":
                restored = taskRepository.findById(id).map(t -> {
                    if (t.getUserId().equals(userId)) {
                        t.setIsDeleted(false);
                        t.setDeletedAt(null);
                        taskRepository.save(t);
                        return true;
                    }
                    return false;
                }).orElse(false);
                break;

            case "goal":
                restored = goalRepository.findById(id).map(g -> {
                    if (g.getUserId().equals(userId)) {
                        g.setIsDeleted(false);
                        g.setDeletedAt(null);
                        goalRepository.save(g);
                        return true;
                    }
                    return false;
                }).orElse(false);
                break;

            case "habit":
                restored = habitRepository.findById(id).map(h -> {
                    if (h.getUserId().equals(userId)) {
                        h.setIsDeleted(false);
                        h.setDeletedAt(null);
                        habitRepository.save(h);
                        return true;
                    }
                    return false;
                }).orElse(false);
                break;

            case "note":
                restored = noteRepository.findById(id).map(n -> {
                    if (n.getUserId().equals(userId)) {
                        n.setIsDeleted(false);
                        n.setDeletedAt(null);
                        noteRepository.save(n);
                        return true;
                    }
                    return false;
                }).orElse(false);
                break;

            case "mistake":
                restored = mistakeRepository.findById(id).map(m -> {
                    if (m.getUserId().equals(userId)) {
                        m.setIsDeleted(false);
                        m.setDeletedAt(null);
                        mistakeRepository.save(m);
                        return true;
                    }
                    return false;
                }).orElse(false);
                break;

            case "test":
                restored = testAttemptRepository.findById(id).map(t -> {
                    if (t.getUserId().equals(userId)) {
                        t.setIsDeleted(false);
                        t.setDeletedAt(null);
                        testAttemptRepository.save(t);
                        return true;
                    }
                    return false;
                }).orElse(false);
                break;
        }

        if (restored) {
            Map<String, String> res = new HashMap<>();
            res.put("message", "Item successfully restored.");
            return ResponseEntity.ok(res);
        }
        return ResponseEntity.badRequest().build();
    }

    @DeleteMapping("/purge/{type}/{id}")
    public ResponseEntity<Void> purgeItem(@PathVariable String type, @PathVariable Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        switch (type.toLowerCase()) {
            case "task":
                taskRepository.findById(id).ifPresent(t -> {
                    if (t.getUserId().equals(userId)) taskRepository.delete(t);
                });
                break;
            case "goal":
                goalRepository.findById(id).ifPresent(g -> {
                    if (g.getUserId().equals(userId)) goalRepository.delete(g);
                });
                break;
            case "habit":
                habitRepository.findById(id).ifPresent(h -> {
                    if (h.getUserId().equals(userId)) habitRepository.delete(h);
                });
                break;
            case "note":
                noteRepository.findById(id).ifPresent(n -> {
                    if (n.getUserId().equals(userId)) noteRepository.delete(n);
                });
                break;
            case "mistake":
                mistakeRepository.findById(id).ifPresent(m -> {
                    if (m.getUserId().equals(userId)) mistakeRepository.delete(m);
                });
                break;
            case "test":
                testAttemptRepository.findById(id).ifPresent(t -> {
                    if (t.getUserId().equals(userId)) testAttemptRepository.delete(t);
                });
                break;
        }
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/empty")
    public ResponseEntity<Void> emptyTrash() {
        Long userId = SecurityUtils.getCurrentUserId();

        taskRepository.findByUserIdAndIsDeletedTrue(userId).forEach(taskRepository::delete);
        goalRepository.findByUserIdAndIsDeletedTrue(userId).forEach(goalRepository::delete);
        habitRepository.findByUserIdAndIsDeletedTrue(userId).forEach(habitRepository::delete);
        noteRepository.findByUserIdAndIsDeletedTrue(userId).forEach(noteRepository::delete);
        mistakeRepository.findByUserIdAndIsDeletedTrue(userId).forEach(mistakeRepository::delete);
        testAttemptRepository.findByUserIdAndIsDeletedTrue(userId).forEach(testAttemptRepository::delete);

        return ResponseEntity.noContent().build();
    }

    private void purgeExpiredItems(Long userId) {
        LocalDateTime cutoff = LocalDateTime.now().minusDays(30);

        taskRepository.findByUserIdAndIsDeletedTrue(userId).stream()
                .filter(t -> t.getDeletedAt() != null && t.getDeletedAt().isBefore(cutoff))
                .forEach(taskRepository::delete);

        goalRepository.findByUserIdAndIsDeletedTrue(userId).stream()
                .filter(g -> g.getDeletedAt() != null && g.getDeletedAt().isBefore(cutoff))
                .forEach(goalRepository::delete);

        habitRepository.findByUserIdAndIsDeletedTrue(userId).stream()
                .filter(h -> h.getDeletedAt() != null && h.getDeletedAt().isBefore(cutoff))
                .forEach(habitRepository::delete);

        noteRepository.findByUserIdAndIsDeletedTrue(userId).stream()
                .filter(n -> n.getDeletedAt() != null && n.getDeletedAt().isBefore(cutoff))
                .forEach(noteRepository::delete);
    }
}
