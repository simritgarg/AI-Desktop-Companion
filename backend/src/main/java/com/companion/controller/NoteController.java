package com.companion.controller;

import com.companion.entity.NoteEntity;
import com.companion.repository.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "*")
public class NoteController {

    @Autowired
    private NoteRepository noteRepository;

    @GetMapping
    public ResponseEntity<List<NoteEntity>> getNotes(@RequestParam(required = false) String category) {
        if (category != null && !category.isEmpty()) {
            return ResponseEntity.ok(noteRepository.findByCategory(category));
        }
        return ResponseEntity.ok(noteRepository.findAllByOrderByIsPinnedDescUpdatedAtDesc());
    }

    @PostMapping
    public ResponseEntity<NoteEntity> createNote(@RequestBody NoteEntity note) {
        return ResponseEntity.ok(noteRepository.save(note));
    }

    @PutMapping("/{id}")
    public ResponseEntity<NoteEntity> updateNote(@PathVariable Long id, @RequestBody NoteEntity details) {
        return noteRepository.findById(id).map(existing -> {
            existing.setTitle(details.getTitle());
            existing.setCategory(details.getCategory());
            existing.setSubject(details.getSubject());
            existing.setContent(details.getContent());
            existing.setTags(details.getTags());
            existing.setIsPinned(details.getIsPinned());
            return ResponseEntity.ok(noteRepository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNote(@PathVariable Long id) {
        if (noteRepository.existsById(id)) {
            noteRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
