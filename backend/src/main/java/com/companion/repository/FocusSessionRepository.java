package com.companion.repository;

import com.companion.entity.FocusSessionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface FocusSessionRepository extends JpaRepository<FocusSessionEntity, Long> {
    Optional<FocusSessionEntity> findByStatus(String status);
    List<FocusSessionEntity> findByTaskId(Long taskId);
}
