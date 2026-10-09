package com.companion.repository;

import com.companion.entity.TestPlatformEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestPlatformRepository extends JpaRepository<TestPlatformEntity, Long> {
    List<TestPlatformEntity> findByExamCategory(String examCategory);
}
