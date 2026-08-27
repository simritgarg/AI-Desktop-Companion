package com.companion.controller;

import com.companion.entity.ReminderEntity;
import com.companion.repository.ReminderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/reminders")
@CrossOrigin(origins = "*")
public class ReminderController {

    @Autowired
    private ReminderRepository reminderRepository;

    @GetMapping
    public ResponseEntity<List<ReminderEntity>> getActiveReminders() {
        return ResponseEntity.ok(reminderRepository.findByIsActiveTrue());
    }

    @PostMapping
    public ResponseEntity<ReminderEntity> createReminder(@RequestBody ReminderEntity reminder) {
        if (reminder.getAnimationType() == null) reminder.setAnimationType("DRINKING");
        if (reminder.getIsActive() == null) reminder.setIsActive(true);
        return ResponseEntity.ok(reminderRepository.save(reminder));
    }

    @PostMapping("/{id}/snooze")
    public ResponseEntity<ReminderEntity> snoozeReminder(@PathVariable Long id, @RequestParam(defaultValue = "15") Integer minutes) {
        return reminderRepository.findById(id).map(reminder -> {
            reminder.setScheduledAt(LocalDateTime.now().plusMinutes(minutes));
            reminder.setSnoozeCount(reminder.getSnoozeCount() + 1);
            return ResponseEntity.ok(reminderRepository.save(reminder));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/dismiss")
    public ResponseEntity<ReminderEntity> dismissReminder(@PathVariable Long id) {
        return reminderRepository.findById(id).map(reminder -> {
            reminder.setLastTriggeredAt(LocalDateTime.now());
            if ("TIME_BASED".equals(reminder.getReminderType())) {
                reminder.setIsActive(false);
            }
            return ResponseEntity.ok(reminderRepository.save(reminder));
        }).orElse(ResponseEntity.notFound().build());
    }
}
