package com.companion.controller;

import com.companion.entity.FocusSessionEntity;
import com.companion.repository.FocusSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/focus")
@CrossOrigin(origins = "*")
public class FocusSessionController {

    @Autowired
    private FocusSessionRepository focusSessionRepository;

    @GetMapping("/current")
    public ResponseEntity<FocusSessionEntity> getCurrentSession() {
        Optional<FocusSessionEntity> active = focusSessionRepository.findByStatus("IN_PROGRESS");
        return active.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.noContent().build());
    }

    @PostMapping("/start")
    public ResponseEntity<FocusSessionEntity> startSession(@RequestBody FocusSessionEntity session) {
        // Complete any existing in-progress session
        focusSessionRepository.findByStatus("IN_PROGRESS").ifPresent(active -> {
            active.setStatus("INTERRUPTED");
            active.setEndedAt(LocalDateTime.now());
            focusSessionRepository.save(active);
        });

        if (session.getSessionType() == null) session.setSessionType("POMODORO");
        if (session.getTargetDurationMinutes() == null) session.setTargetDurationMinutes(25);
        session.setStatus("IN_PROGRESS");
        session.setStartedAt(LocalDateTime.now());

        return ResponseEntity.ok(focusSessionRepository.save(session));
    }

    @PostMapping("/{id}/end")
    public ResponseEntity<FocusSessionEntity> endSession(@PathVariable Long id, @RequestParam(defaultValue = "25") Integer focusMinutes) {
        return focusSessionRepository.findById(id).map(session -> {
            session.setStatus("COMPLETED");
            session.setActualFocusMinutes(focusMinutes);
            session.setEndedAt(LocalDateTime.now());
            return ResponseEntity.ok(focusSessionRepository.save(session));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/distraction")
    public ResponseEntity<FocusSessionEntity> recordDistraction(@PathVariable Long id) {
        return focusSessionRepository.findById(id).map(session -> {
            session.setDistractionCount(session.getDistractionCount() + 1);
            return ResponseEntity.ok(focusSessionRepository.save(session));
        }).orElse(ResponseEntity.notFound().build());
    }
}
