package com.companion.repository;

import com.companion.entity.ReminderEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReminderRepository extends JpaRepository<ReminderEntity, Long> {
    List<ReminderEntity> findByIsActiveTrue();
    List<ReminderEntity> findByReminderType(String reminderType);
}
