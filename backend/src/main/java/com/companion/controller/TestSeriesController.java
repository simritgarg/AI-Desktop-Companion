package com.companion.controller;

import com.companion.entity.TestAttemptEntity;
import com.companion.entity.TestPlatformEntity;
import com.companion.repository.TestAttemptRepository;
import com.companion.repository.TestPlatformRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
        if (platform != null && !platform.isEmpty()) {
            return ResponseEntity.ok(testAttemptRepository.findByPlatformName(platform));
        }
        return ResponseEntity.ok(testAttemptRepository.findAllByOrderByAttemptDateDesc());
    }

    @PostMapping("/attempts")
    public ResponseEntity<TestAttemptEntity> recordAttempt(@RequestBody TestAttemptEntity attempt) {
        // Calculate accuracy & attempt rate automatically if missing
        if (attempt.getAccuracyPercentage() == 0.0 && attempt.getCorrectAnswers() + attempt.getIncorrectAnswers() > 0) {
            double totalAttempted = attempt.getCorrectAnswers() + attempt.getIncorrectAnswers();
            attempt.setAccuracyPercentage((attempt.getCorrectAnswers() / totalAttempted) * 100.0);
        }
        return ResponseEntity.ok(testAttemptRepository.save(attempt));
    }

    @DeleteMapping("/attempts/{id}")
    public ResponseEntity<Void> deleteAttempt(@PathVariable Long id) {
        if (testAttemptRepository.existsById(id)) {
            testAttemptRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/analytics/summary")
    public ResponseEntity<Map<String, Object>> getAnalyticsSummary() {
        List<TestAttemptEntity> attempts = testAttemptRepository.findAllByOrderByAttemptDateDesc();
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
