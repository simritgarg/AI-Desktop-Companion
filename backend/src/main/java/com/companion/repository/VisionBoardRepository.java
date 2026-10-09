package com.companion.repository;

import com.companion.entity.VisionBoardEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VisionBoardRepository extends JpaRepository<VisionBoardEntity, Long> {
    List<VisionBoardEntity> findByCategory(String category);
}
