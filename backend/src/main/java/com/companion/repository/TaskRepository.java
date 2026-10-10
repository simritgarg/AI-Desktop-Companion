package com.companion.repository;

import com.companion.entity.TaskEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskRepository extends JpaRepository<TaskEntity, Long> {
    List<TaskEntity> findByStatus(String status);
    List<TaskEntity> findByGoalId(Long goalId);
    List<TaskEntity> findByIsTopPriorityTrue();

    List<TaskEntity> findByUserIdAndIsDeletedFalse(Long userId);
    List<TaskEntity> findByUserIdAndStatusAndIsDeletedFalse(Long userId, String status);
    List<TaskEntity> findByUserIdAndGoalIdAndIsDeletedFalse(Long userId, Long goalId);
    List<TaskEntity> findByUserIdAndIsTopPriorityTrueAndIsDeletedFalse(Long userId);
    List<TaskEntity> findByUserIdAndIsDeletedTrue(Long userId);
    List<TaskEntity> findByGoalIdAndIsDeletedFalse(Long goalId);
}
