package com.companion.repository;

import com.companion.entity.DailyStatisticsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.Optional;

public interface DailyStatisticsRepository extends JpaRepository<DailyStatisticsEntity, Long> {
    Optional<DailyStatisticsEntity> findByDate(LocalDate date);
}
