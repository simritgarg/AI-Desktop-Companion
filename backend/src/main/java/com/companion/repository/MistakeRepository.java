package com.companion.repository;

import com.companion.entity.MistakeRecordEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MistakeRepository extends JpaRepository<MistakeRecordEntity, Long> {
    List<MistakeRecordEntity> findBySubject(String subject);
    List<MistakeRecordEntity> findByMistakeCategory(String mistakeCategory);
    List<MistakeRecordEntity> findByReviewStatus(String reviewStatus);
}
