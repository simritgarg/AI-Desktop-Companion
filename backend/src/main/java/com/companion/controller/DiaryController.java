package com.companion.controller;

import com.companion.entity.DiaryEntryEntity;
import com.companion.repository.DiaryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/diary")
@CrossOrigin(origins = "*")
public class DiaryController {

    @Autowired
    private DiaryRepository diaryRepository;

    @GetMapping
    public ResponseEntity<List<DiaryEntryEntity>> getAllEntries() {
        return ResponseEntity.ok(diaryRepository.findAllByOrderByEntryDateDesc());
    }

    @GetMapping("/by-date")
    public ResponseEntity<DiaryEntryEntity> getEntryByDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return diaryRepository.findByEntryDate(date)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DiaryEntryEntity> getEntryById(@PathVariable Long id) {
        return diaryRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<DiaryEntryEntity> saveEntry(@RequestBody DiaryEntryEntity entry) {
        if (entry.getEntryDate() == null) {
            entry.setEntryDate(LocalDate.now());
        }
        // If entry for date already exists, update it instead of duplicate
        return diaryRepository.findByEntryDate(entry.getEntryDate())
                .map(existing -> {
                    existing.setTitle(entry.getTitle());
                    existing.setContent(entry.getContent());
                    existing.setMood(entry.getMood());
                    existing.setHighlights(entry.getHighlights());
                    existing.setWhatILearned(entry.getWhatILearned());
                    existing.setWhatWentWell(entry.getWhatWentWell());
                    existing.setStruggles(entry.getStruggles());
                    existing.setLessonsFromMocks(entry.getLessonsFromMocks());
                    existing.setTomorrowIntention(entry.getTomorrowIntention());
                    existing.setIsFavorite(entry.getIsFavorite());
                    return ResponseEntity.ok(diaryRepository.save(existing));
                })
                .orElseGet(() -> ResponseEntity.ok(diaryRepository.save(entry)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEntry(@PathVariable Long id) {
        if (diaryRepository.existsById(id)) {
            diaryRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
