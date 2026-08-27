package com.companion.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AIChatRequest {
    private String prompt;
    private String accountabilityMode; // FRIENDLY, BALANCED, STRICT, NO_EXCUSES
    private String personality; // BEST_FRIEND, COACH, STUDY_BUDDY, STRICT_MENTOR
    private String currentFocusTask;
}
