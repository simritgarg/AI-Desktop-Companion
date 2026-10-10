package com.companion.repository;

import com.companion.entity.TestAttemptEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TestAttemptRepository extends JpaRepository<TestAttemptEntity, Long> {
    List<TestAttemptEntity> findByPlatformName(String platformName);
    List<TestAttemptEntity> findAllByOrderByAttemptDateDesc();

    List<TestAttemptEntity> findByUserIdAndIsDeletedFalseOrderByAttemptDateDesc(Long userId);
    List<TestAttemptEntity> findByUserIdAndPlatformNameAndIsDeletedFalse(Long userId, String platformName);
    List<TestAttemptEntity> findByUserIdAndIsDeletedTrue(Long userId);
}
