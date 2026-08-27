package com.companion.repository;

import com.companion.entity.HabitCompletionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HabitCompletionRepository extends JpaRepository<HabitCompletionEntity, Long> {
    List<HabitCompletionEntity> findByHabitId(Long habitId);
}
