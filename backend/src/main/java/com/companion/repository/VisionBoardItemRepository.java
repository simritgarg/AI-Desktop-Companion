package com.companion.repository;

import com.companion.entity.VisionBoardItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VisionBoardItemRepository extends JpaRepository<VisionBoardItemEntity, Long> {
    List<VisionBoardItemEntity> findByBoardIdOrderByDisplayOrderAsc(Long boardId);
}
