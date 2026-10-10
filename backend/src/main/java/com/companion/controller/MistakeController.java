package com.companion.controller;

import com.companion.entity.MistakeRecordEntity;
import com.companion.repository.MistakeRepository;
import com.companion.util.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
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
        Long userId = SecurityUtils.getCurrentUserId();
        List<MistakeRecordEntity> mistakes = mistakeRepository.findByUserIdAndIsDeletedFalse(userId);

        if (subject != null && !subject.isEmpty()) {
            mistakes = mistakes.stream().filter(m -> subject.equalsIgnoreCase(m.getSubject())).toList();
        }
        if (mistakeCategory != null && !mistakeCategory.isEmpty()) {
            mistakes = mistakes.stream().filter(m -> mistakeCategory.equalsIgnoreCase(m.getMistakeCategory())).toList();
        }
        return ResponseEntity.ok(mistakes);
    }

    @PostMapping
    public ResponseEntity<MistakeRecordEntity> createMistake(@RequestBody MistakeRecordEntity mistake) {
        Long userId = SecurityUtils.getCurrentUserId();
        mistake.setUserId(userId);
        if (mistake.getIsDeleted() == null) mistake.setIsDeleted(false);
        return ResponseEntity.ok(mistakeRepository.save(mistake));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MistakeRecordEntity> updateMistake(@PathVariable Long id, @RequestBody MistakeRecordEntity details) {
        Long userId = SecurityUtils.getCurrentUserId();
        return mistakeRepository.findById(id)
                .filter(m -> m.getUserId().equals(userId))
                .map(existing -> {
                    if (details.getQuestionText() != null) existing.setQuestionText(details.getQuestionText());
                    if (details.getCorrectAnswer() != null) existing.setCorrectAnswer(details.getCorrectAnswer());
                    if (details.getUserAnswer() != null) existing.setUserAnswer(details.getUserAnswer());
                    if (details.getExplanation() != null) existing.setExplanation(details.getExplanation());
                    if (details.getSubject() != null) existing.setSubject(details.getSubject());
                    if (details.getTopic() != null) existing.setTopic(details.getTopic());
                    if (details.getMistakeCategory() != null) existing.setMistakeCategory(details.getMistakeCategory());
                    if (details.getPersonalNotes() != null) existing.setPersonalNotes(details.getPersonalNotes());
                    if (details.getReviewStatus() != null) existing.setReviewStatus(details.getReviewStatus());
                    if (details.getReviewCount() != null) existing.setReviewCount(details.getReviewCount());
                    return ResponseEntity.ok(mistakeRepository.save(existing));
                }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMistake(@PathVariable Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        return mistakeRepository.findById(id)
                .filter(m -> m.getUserId().equals(userId))
                .map(m -> {
                    m.setIsDeleted(true);
                    m.setDeletedAt(LocalDateTime.now());
                    mistakeRepository.save(m);
                    return ResponseEntity.noContent().<Void>build();
                }).orElse(ResponseEntity.notFound().build());
    }
}
