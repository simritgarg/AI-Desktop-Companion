package com.companion.repository;

import com.companion.entity.HabitEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HabitRepository extends JpaRepository<HabitEntity, Long> {
    List<HabitEntity> findByUserIdAndIsDeletedFalse(Long userId);
    List<HabitEntity> findByUserIdAndCategoryAndIsDeletedFalse(Long userId, String category);
    List<HabitEntity> findByUserIdAndIsDeletedTrue(Long userId);
}
