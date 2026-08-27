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
public class DailyAnalysisResponse {
    private String summary;
    private String whatWentWell;
    private String whatWentWrong;
    private String patternNoticed;
    private String oneThingToChangeTomorrow;
    private String uncomfortableTruth;
    private List<String> tomorrowTopPriorities;
    private Integer productivityScore; // 0 to 100
}
