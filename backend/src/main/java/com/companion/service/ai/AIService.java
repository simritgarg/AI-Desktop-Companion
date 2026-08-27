package com.companion.service.ai;

import com.companion.dto.AIChatRequest;
import com.companion.dto.AICoachResponse;
import com.companion.dto.DailyAnalysisResponse;
import com.companion.dto.TaskBreakdownRequest;
import com.companion.dto.TaskBreakdownResponse;

public interface AIService {
    AICoachResponse processChat(AIChatRequest request);
    TaskBreakdownResponse breakdownGoal(TaskBreakdownRequest request);
    DailyAnalysisResponse generateDailyAnalysis();
    AICoachResponse recommendNextAction();
    boolean isConfigured();
    String getProviderName();
}
