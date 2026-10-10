package com.companion.repository;

import com.companion.entity.CareerSubjectEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CareerSubjectRepository extends JpaRepository<CareerSubjectEntity, Long> {
    List<CareerSubjectEntity> findByUserIdAndWorkspaceIdAndIsDeletedFalse(Long userId, Long workspaceId);
    List<CareerSubjectEntity> findByUserIdAndIsDeletedFalse(Long userId);
    List<CareerSubjectEntity> findByUserIdAndIsDeletedTrue(Long userId);
}
