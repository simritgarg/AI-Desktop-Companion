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
public class AICoachResponse {
    private String message;
    private String animationState; // IDLE, TALKING, CELEBRATING, DISAPPOINTED, DRINKING, STUDYING, STRETCHING
    private String recommendedAction;
    private List<String> actionButtons;
}
