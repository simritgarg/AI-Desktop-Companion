package com.companion.repository;

import com.companion.entity.MistakeRecordEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MistakeRepository extends JpaRepository<MistakeRecordEntity, Long> {
    List<MistakeRecordEntity> findBySubject(String subject);
    List<MistakeRecordEntity> findByMistakeCategory(String mistakeCategory);

    List<MistakeRecordEntity> findByUserIdAndIsDeletedFalse(Long userId);
    List<MistakeRecordEntity> findByUserIdAndSubjectAndIsDeletedFalse(Long userId, String subject);
    List<MistakeRecordEntity> findByUserIdAndMistakeCategoryAndIsDeletedFalse(Long userId, String mistakeCategory);
    List<MistakeRecordEntity> findByUserIdAndIsDeletedTrue(Long userId);
}
