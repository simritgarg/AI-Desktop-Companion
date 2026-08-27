package com.companion.repository;

import com.companion.entity.GoalEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GoalRepository extends JpaRepository<GoalEntity, Long> {
    List<GoalEntity> findByGoalType(String goalType);
    List<GoalEntity> findByParentGoalId(Long parentGoalId);
    List<GoalEntity> findByStatus(String status);
}
