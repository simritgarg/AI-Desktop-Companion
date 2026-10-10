package com.companion.repository;

import com.companion.entity.NoteEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NoteRepository extends JpaRepository<NoteEntity, Long> {
    List<NoteEntity> findByUserIdAndIsDeletedFalse(Long userId);
    List<NoteEntity> findByUserIdAndCategoryAndIsDeletedFalse(Long userId, String category);
    List<NoteEntity> findByUserIdAndSubjectAndIsDeletedFalse(Long userId, String subject);
    List<NoteEntity> findByUserIdAndIsDeletedTrue(Long userId);
}
