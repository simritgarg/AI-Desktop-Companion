package com.companion.service.ai;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import com.companion.dto.*;

@Service
@Primary
public class AIServiceFactory implements AIService {

    @Value("${app.ai.provider:local}")
    private String provider;

    @Autowired
    private LocalRuleBasedAIService localService;

    @Autowired
    private OpenAIAIService openAIService;

    private AIService getActiveService() {
        if ("openai".equalsIgnoreCase(provider) && openAIService.isConfigured()) {
            return openAIService;
        }
        return localService;
    }

    @Override
    public AICoachResponse processChat(AIChatRequest request) {
        return getActiveService().processChat(request);
    }

    @Override
    public TaskBreakdownResponse breakdownGoal(TaskBreakdownRequest request) {
        return getActiveService().breakdownGoal(request);
    }

    @Override
    public DailyAnalysisResponse generateDailyAnalysis() {
        return getActiveService().generateDailyAnalysis();
    }

    @Override
    public AICoachResponse recommendNextAction() {
        return getActiveService().recommendNextAction();
    }

    @Override
    public boolean isConfigured() {
        return getActiveService().isConfigured();
    }

    @Override
    public String getProviderName() {
        return getActiveService().getProviderName();
    }
}
