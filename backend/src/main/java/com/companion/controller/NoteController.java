package com.companion.controller;

import com.companion.entity.NoteEntity;
import com.companion.repository.NoteRepository;
import com.companion.util.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "*")
public class NoteController {

    @Autowired
    private NoteRepository noteRepository;

    @GetMapping
    public ResponseEntity<List<NoteEntity>> getNotes(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String subject) {
        Long userId = SecurityUtils.getCurrentUserId();
        List<NoteEntity> notes = noteRepository.findByUserIdAndIsDeletedFalse(userId);

        if (category != null && !category.isEmpty()) {
            notes = notes.stream().filter(n -> category.equalsIgnoreCase(n.getCategory())).toList();
        }
        if (subject != null && !subject.isEmpty()) {
            notes = notes.stream().filter(n -> subject.equalsIgnoreCase(n.getSubject())).toList();
        }
        return ResponseEntity.ok(notes);
    }

    @PostMapping
    public ResponseEntity<NoteEntity> createNote(@RequestBody NoteEntity note) {
        Long userId = SecurityUtils.getCurrentUserId();
        note.setUserId(userId);
        if (note.getCategory() == null) note.setCategory("GENERAL");
        if (note.getIsPinned() == null) note.setIsPinned(false);
        if (note.getIsChecklist() == null) note.setIsChecklist(false);
        if (note.getIsDeleted() == null) note.setIsDeleted(false);
        if (note.getColor() == null) note.setColor("#1F2937");
        return ResponseEntity.ok(noteRepository.save(note));
    }

    @PutMapping("/{id}")
    public ResponseEntity<NoteEntity> updateNote(@PathVariable Long id, @RequestBody NoteEntity details) {
        Long userId = SecurityUtils.getCurrentUserId();
        return noteRepository.findById(id)
                .filter(n -> n.getUserId().equals(userId))
                .map(note -> {
                    if (details.getTitle() != null) note.setTitle(details.getTitle());
                    if (details.getCategory() != null) note.setCategory(details.getCategory());
                    if (details.getSubject() != null) note.setSubject(details.getSubject());
                    if (details.getContent() != null) note.setContent(details.getContent());
                    if (details.getChecklistJson() != null) note.setChecklistJson(details.getChecklistJson());
                    if (details.getIsChecklist() != null) note.setIsChecklist(details.getIsChecklist());
                    if (details.getColor() != null) note.setColor(details.getColor());
                    if (details.getTags() != null) note.setTags(details.getTags());
                    if (details.getIsPinned() != null) note.setIsPinned(details.getIsPinned());
                    return ResponseEntity.ok(noteRepository.save(note));
                }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNote(@PathVariable Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        return noteRepository.findById(id)
                .filter(n -> n.getUserId().equals(userId))
                .map(note -> {
                    note.setIsDeleted(true);
                    note.setDeletedAt(LocalDateTime.now());
                    noteRepository.save(note);
                    return ResponseEntity.noContent().<Void>build();
                }).orElse(ResponseEntity.notFound().build());
    }
}
