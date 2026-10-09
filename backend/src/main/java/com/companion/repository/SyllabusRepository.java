package com.companion.repository;

import com.companion.entity.SyllabusTopicEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SyllabusRepository extends JpaRepository<SyllabusTopicEntity, Long> {
    List<SyllabusTopicEntity> findByCategory(String category);
    List<SyllabusTopicEntity> findByCategoryAndSubject(String category, String subject);
    List<SyllabusTopicEntity> findByStatus(String status);
}
