package com.companion.repository;

import com.companion.entity.NoteEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoteRepository extends JpaRepository<NoteEntity, Long> {
    List<NoteEntity> findByCategory(String category);
    List<NoteEntity> findAllByOrderByIsPinnedDescUpdatedAtDesc();
}
