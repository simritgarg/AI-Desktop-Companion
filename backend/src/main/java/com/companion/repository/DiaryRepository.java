package com.companion.repository;

import com.companion.entity.DiaryEntryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DiaryRepository extends JpaRepository<DiaryEntryEntity, Long> {
    Optional<DiaryEntryEntity> findByEntryDate(LocalDate entryDate);
    List<DiaryEntryEntity> findAllByOrderByEntryDateDesc();
    List<DiaryEntryEntity> findByIsFavoriteTrue();
}
