package com.companion.repository;

import com.companion.entity.AIMemoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface AIMemoryRepository extends JpaRepository<AIMemoryEntity, Long> {
    Optional<AIMemoryEntity> findByMemoryKey(String memoryKey);
    List<AIMemoryEntity> findByCategory(String category);
}
