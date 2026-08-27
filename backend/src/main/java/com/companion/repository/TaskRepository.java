package com.companion.repository;

import com.companion.entity.TaskEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskRepository extends JpaRepository<TaskEntity, Long> {
    List<TaskEntity> findByStatus(String status);
    List<TaskEntity> findByGoalId(Long goalId);
    List<TaskEntity> findByIsTopPriorityTrue();
}
