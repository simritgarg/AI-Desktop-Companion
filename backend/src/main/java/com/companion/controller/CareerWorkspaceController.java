package com.companion.controller;

import com.companion.entity.CareerSubjectEntity;
import com.companion.entity.CareerWorkspaceEntity;
import com.companion.repository.CareerSubjectRepository;
import com.companion.repository.CareerWorkspaceRepository;
import com.companion.util.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/career-workspaces")
@CrossOrigin(origins = "*")
public class CareerWorkspaceController {

    @Autowired
    private CareerWorkspaceRepository workspaceRepository;

    @Autowired
    private CareerSubjectRepository subjectRepository;

    @GetMapping
    public ResponseEntity<List<CareerWorkspaceEntity>> getWorkspaces() {
        Long userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(workspaceRepository.findByUserIdAndIsDeletedFalse(userId));
    }

    @PostMapping
    public ResponseEntity<CareerWorkspaceEntity> createWorkspace(@RequestBody CareerWorkspaceEntity workspace) {
        Long userId = SecurityUtils.getCurrentUserId();
        workspace.setUserId(userId);
        if (workspace.getIsDeleted() == null) workspace.setIsDeleted(false);
        return ResponseEntity.ok(workspaceRepository.save(workspace));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CareerWorkspaceEntity> updateWorkspace(@PathVariable Long id, @RequestBody CareerWorkspaceEntity details) {
        Long userId = SecurityUtils.getCurrentUserId();
        return workspaceRepository.findById(id)
                .filter(w -> w.getUserId().equals(userId))
                .map(w -> {
                    if (details.getName() != null) w.setName(details.getName());
                    if (details.getDescription() != null) w.setDescription(details.getDescription());
                    if (details.getIcon() != null) w.setIcon(details.getIcon());
                    return ResponseEntity.ok(workspaceRepository.save(w));
                }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkspace(@PathVariable Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        return workspaceRepository.findById(id)
                .filter(w -> w.getUserId().equals(userId))
                .map(w -> {
                    w.setIsDeleted(true);
                    w.setDeletedAt(LocalDateTime.now());
                    workspaceRepository.save(w);
                    return ResponseEntity.noContent().<Void>build();
                }).orElse(ResponseEntity.notFound().build());
    }

    // --- SUBJECT MANAGEMENT ---

    @GetMapping("/{workspaceId}/subjects")
    public ResponseEntity<List<CareerSubjectEntity>> getSubjects(@PathVariable Long workspaceId) {
        Long userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(subjectRepository.findByUserIdAndWorkspaceIdAndIsDeletedFalse(userId, workspaceId));
    }

    @PostMapping("/{workspaceId}/subjects")
    public ResponseEntity<CareerSubjectEntity> createSubject(@PathVariable Long workspaceId, @RequestBody CareerSubjectEntity subject) {
        Long userId = SecurityUtils.getCurrentUserId();
        subject.setUserId(userId);
        subject.setWorkspaceId(workspaceId);
        if (subject.getIsDeleted() == null) subject.setIsDeleted(false);
        return ResponseEntity.ok(subjectRepository.save(subject));
    }

    @PutMapping("/subjects/{subjectId}")
    public ResponseEntity<CareerSubjectEntity> updateSubject(@PathVariable Long subjectId, @RequestBody CareerSubjectEntity details) {
        Long userId = SecurityUtils.getCurrentUserId();
        return subjectRepository.findById(subjectId)
                .filter(s -> s.getUserId().equals(userId))
                .map(s -> {
                    if (details.getSubjectName() != null) s.setSubjectName(details.getSubjectName());
                    if (details.getDescription() != null) s.setDescription(details.getDescription());
                    if (details.getColor() != null) s.setColor(details.getColor());
                    return ResponseEntity.ok(subjectRepository.save(s));
                }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/subjects/{subjectId}")
    public ResponseEntity<Void> deleteSubject(@PathVariable Long subjectId) {
        Long userId = SecurityUtils.getCurrentUserId();
        return subjectRepository.findById(subjectId)
                .filter(s -> s.getUserId().equals(userId))
                .map(s -> {
                    s.setIsDeleted(true);
                    s.setDeletedAt(LocalDateTime.now());
                    subjectRepository.save(s);
                    return ResponseEntity.noContent().<Void>build();
                }).orElse(ResponseEntity.notFound().build());
    }
}
