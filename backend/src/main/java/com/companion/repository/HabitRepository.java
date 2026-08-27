package com.companion.repository;

import com.companion.entity.HabitEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HabitRepository extends JpaRepository<HabitEntity, Long> {
}
