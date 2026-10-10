package com.companion.controller;

import com.companion.entity.TestAttemptEntity;
import com.companion.entity.TestPlatformEntity;
import com.companion.repository.TestAttemptRepository;
import com.companion.repository.TestPlatformRepository;
import com.companion.util.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tests")
@CrossOrigin(origins = "*")
public class TestSeriesController {

    @Autowired
    private TestPlatformRepository testPlatformRepository;

    @Autowired
    private TestAttemptRepository testAttemptRepository;

    @GetMapping("/platforms")
    public ResponseEntity<List<TestPlatformEntity>> getPlatforms() {
        return ResponseEntity.ok(testPlatformRepository.findAll());
    }

    @PostMapping("/platforms")
    public ResponseEntity<TestPlatformEntity> createPlatform(@RequestBody TestPlatformEntity platform) {
        return ResponseEntity.ok(testPlatformRepository.save(platform));
    }

    @GetMapping("/attempts")
    public ResponseEntity<List<TestAttemptEntity>> getAttempts(@RequestParam(required = false) String platform) {
        Long userId = SecurityUtils.getCurrentUserId();
        List<TestAttemptEntity> attempts = testAttemptRepository.findByUserIdAndIsDeletedFalseOrderByAttemptDateDesc(userId);
        if (platform != null && !platform.isEmpty()) {
            attempts = attempts.stream()
                    .filter(a -> platform.equalsIgnoreCase(a.getPlatformName()))
                    .toList();
        }
        return ResponseEntity.ok(attempts);
    }

    @PostMapping("/attempts")
    public ResponseEntity<TestAttemptEntity> recordAttempt(@RequestBody TestAttemptEntity attempt) {
        Long userId = SecurityUtils.getCurrentUserId();
        attempt.setUserId(userId);
        if (attempt.getIsDeleted() == null) attempt.setIsDeleted(false);

        // Calculate accuracy & attempt rate automatically if missing
        if ((attempt.getAccuracyPercentage() == null || attempt.getAccuracyPercentage() == 0.0)
                && attempt.getCorrectAnswers() != null
                && attempt.getIncorrectAnswers() != null
                && (attempt.getCorrectAnswers() + attempt.getIncorrectAnswers() > 0)) {
            double totalAttempted = attempt.getCorrectAnswers() + attempt.getIncorrectAnswers();
            attempt.setAccuracyPercentage((attempt.getCorrectAnswers() / totalAttempted) * 100.0);
        }
        return ResponseEntity.ok(testAttemptRepository.save(attempt));
    }

    @DeleteMapping("/attempts/{id}")
    public ResponseEntity<Void> deleteAttempt(@PathVariable Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        return testAttemptRepository.findById(id)
                .filter(t -> t.getUserId().equals(userId))
                .map(attempt -> {
                    attempt.setIsDeleted(true);
                    attempt.setDeletedAt(LocalDateTime.now());
                    testAttemptRepository.save(attempt);
                    return ResponseEntity.noContent().<Void>build();
                }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/analytics/summary")
    public ResponseEntity<Map<String, Object>> getAnalyticsSummary() {
        Long userId = SecurityUtils.getCurrentUserId();
        List<TestAttemptEntity> attempts = testAttemptRepository.findByUserIdAndIsDeletedFalseOrderByAttemptDateDesc(userId);
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalAttempts", attempts.size());

        if (attempts.isEmpty()) {
            summary.put("averageScore", 0.0);
            summary.put("bestScore", 0.0);
            summary.put("averageAccuracy", 0.0);
        } else {
            double avgScore = attempts.stream().mapToDouble(TestAttemptEntity::getMarksObtained).average().orElse(0.0);
            double maxScore = attempts.stream().mapToDouble(TestAttemptEntity::getMarksObtained).max().orElse(0.0);
            double avgAcc = attempts.stream().mapToDouble(TestAttemptEntity::getAccuracyPercentage).average().orElse(0.0);
            summary.put("averageScore", Math.round(avgScore * 10.0) / 10.0);
            summary.put("bestScore", maxScore);
            summary.put("averageAccuracy", Math.round(avgAcc * 10.0) / 10.0);
        }

        return ResponseEntity.ok(summary);
    }
}
