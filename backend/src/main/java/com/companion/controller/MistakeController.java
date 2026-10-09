package com.companion.controller;

import com.companion.entity.MistakeRecordEntity;
import com.companion.repository.MistakeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mistakes")
@CrossOrigin(origins = "*")
public class MistakeController {

    @Autowired
    private MistakeRepository mistakeRepository;

    @GetMapping
    public ResponseEntity<List<MistakeRecordEntity>> getMistakes(
            @RequestParam(required = false) String subject,
            @RequestParam(required = false) String mistakeCategory) {
        if (subject != null && !subject.isEmpty()) {
            return ResponseEntity.ok(mistakeRepository.findBySubject(subject));
        }
        if (mistakeCategory != null && !mistakeCategory.isEmpty()) {
            return ResponseEntity.ok(mistakeRepository.findByMistakeCategory(mistakeCategory));
        }
        return ResponseEntity.ok(mistakeRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<MistakeRecordEntity> createMistake(@RequestBody MistakeRecordEntity mistake) {
        return ResponseEntity.ok(mistakeRepository.save(mistake));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MistakeRecordEntity> updateMistake(@PathVariable Long id, @RequestBody MistakeRecordEntity details) {
        return mistakeRepository.findById(id).map(existing -> {
            existing.setQuestionText(details.getQuestionText());
            existing.setCorrectAnswer(details.getCorrectAnswer());
            existing.setUserAnswer(details.getUserAnswer());
            existing.setExplanation(details.getExplanation());
            existing.setSubject(details.getSubject());
            existing.setTopic(details.getTopic());
            existing.setMistakeCategory(details.getMistakeCategory());
            existing.setPersonalNotes(details.getPersonalNotes());
            existing.setReviewStatus(details.getReviewStatus());
            existing.setReviewCount(details.getReviewCount());
            return ResponseEntity.ok(mistakeRepository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMistake(@PathVariable Long id) {
        if (mistakeRepository.existsById(id)) {
            mistakeRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
