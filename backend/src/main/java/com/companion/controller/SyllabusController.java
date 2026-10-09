package com.companion.controller;

import com.companion.entity.SyllabusTopicEntity;
import com.companion.repository.SyllabusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/syllabus")
@CrossOrigin(origins = "*")
public class SyllabusController {

    @Autowired
    private SyllabusRepository syllabusRepository;

    @GetMapping
    public ResponseEntity<List<SyllabusTopicEntity>> getAllTopics(
            @RequestParam(required = false, defaultValue = "SSC_CGL") String category,
            @RequestParam(required = false) String subject) {
        if (subject != null && !subject.isEmpty()) {
            return ResponseEntity.ok(syllabusRepository.findByCategoryAndSubject(category, subject));
        }
        return ResponseEntity.ok(syllabusRepository.findByCategory(category));
    }

    @PostMapping
    public ResponseEntity<SyllabusTopicEntity> createTopic(@RequestBody SyllabusTopicEntity topic) {
        return ResponseEntity.ok(syllabusRepository.save(topic));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SyllabusTopicEntity> updateTopic(@PathVariable Long id, @RequestBody SyllabusTopicEntity topicDetails) {
        return syllabusRepository.findById(id).map(existing -> {
            existing.setSubject(topicDetails.getSubject());
            existing.setTopicName(topicDetails.getTopicName());
            existing.setSubtopicName(topicDetails.getSubtopicName());
            existing.setStatus(topicDetails.getStatus());
            existing.setPriority(topicDetails.getPriority());
            existing.setDifficulty(topicDetails.getDifficulty());
            existing.setTargetCompletionDate(topicDetails.getTargetCompletionDate());
            existing.setEstimatedStudyTimeMinutes(topicDetails.getEstimatedStudyTimeMinutes());
            existing.setActualStudyTimeMinutes(topicDetails.getActualStudyTimeMinutes());
            existing.setNotes(topicDetails.getNotes());
            existing.setFormulaOrShortcuts(topicDetails.getFormulaOrShortcuts());
            existing.setQuestionsPracticedCount(topicDetails.getQuestionsPracticedCount());
            existing.setAccuracyPercentage(topicDetails.getAccuracyPercentage());
            existing.setRevisionCount(topicDetails.getRevisionCount());
            existing.setNextRevisionDate(topicDetails.getNextRevisionDate());
            existing.setConfidenceLevel(topicDetails.getConfidenceLevel());
            return ResponseEntity.ok(syllabusRepository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTopic(@PathVariable Long id) {
        if (syllabusRepository.existsById(id)) {
            syllabusRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
