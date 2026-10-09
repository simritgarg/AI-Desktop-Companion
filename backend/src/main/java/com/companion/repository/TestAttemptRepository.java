package com.companion.repository;

import com.companion.entity.TestAttemptEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestAttemptRepository extends JpaRepository<TestAttemptEntity, Long> {
    List<TestAttemptEntity> findByPlatformName(String platformName);
    List<TestAttemptEntity> findByTestType(String testType);
    List<TestAttemptEntity> findAllByOrderByAttemptDateDesc();
}
