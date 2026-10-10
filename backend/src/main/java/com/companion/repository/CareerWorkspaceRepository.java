package com.companion.repository;

import com.companion.entity.CareerWorkspaceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CareerWorkspaceRepository extends JpaRepository<CareerWorkspaceEntity, Long> {
    List<CareerWorkspaceEntity> findByUserIdAndIsDeletedFalse(Long userId);
    List<CareerWorkspaceEntity> findByUserIdAndIsDeletedTrue(Long userId);
}
