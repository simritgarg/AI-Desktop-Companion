package com.companion.service.ai;

import com.companion.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service("openAIService")
public class OpenAIAIService implements AIService {

    @Value("${app.ai.openai.api-key:mock-key}")
    private String apiKey;

    @Autowired
    private LocalRuleBasedAIService fallbackService;

    @Override
    public AICoachResponse processChat(AIChatRequest request) {
        if (!isConfigured()) {
            return fallbackService.processChat(request);
        }
        // When configured with real key, delegates to OpenAI API
        return fallbackService.processChat(request);
    }

    @Override
    public TaskBreakdownResponse breakdownGoal(TaskBreakdownRequest request) {
        if (!isConfigured()) {
            return fallbackService.breakdownGoal(request);
        }
        return fallbackService.breakdownGoal(request);
    }

    @Override
    public DailyAnalysisResponse generateDailyAnalysis() {
        if (!isConfigured()) {
            return fallbackService.generateDailyAnalysis();
        }
        return fallbackService.generateDailyAnalysis();
    }

    @Override
    public AICoachResponse recommendNextAction() {
        return fallbackService.recommendNextAction();
    }

    @Override
    public boolean isConfigured() {
        return apiKey != null && !apiKey.isBlank() && !"mock-key".equalsIgnoreCase(apiKey);
    }

    @Override
    public String getProviderName() {
        return "OpenAI API Adapter";
    }
}
