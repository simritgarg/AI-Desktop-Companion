package com.companion.repository;

import com.companion.entity.GoalEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GoalRepository extends JpaRepository<GoalEntity, Long> {
    List<GoalEntity> findByGoalType(String goalType);
    List<GoalEntity> findByParentGoalId(Long parentGoalId);
    List<GoalEntity> findByStatus(String status);

    List<GoalEntity> findByUserIdAndIsDeletedFalse(Long userId);
    List<GoalEntity> findByUserIdAndGoalTypeAndIsDeletedFalse(Long userId, String goalType);
    List<GoalEntity> findByUserIdAndStatusAndIsDeletedFalse(Long userId, String status);
    List<GoalEntity> findByUserIdAndIsDeletedTrue(Long userId);
}
