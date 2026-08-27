package com.companion.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskBreakdownResponse {
    private String goalTitle;
    private List<SubTaskDTO> subTasks;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SubTaskDTO {
        private String title;
        private Integer estimatedMinutes;
        private String priority;
    }
}
