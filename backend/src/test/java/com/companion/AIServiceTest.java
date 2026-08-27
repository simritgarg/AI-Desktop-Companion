package com.companion;

import com.companion.dto.AIChatRequest;
import com.companion.dto.AICoachResponse;
import com.companion.service.ai.LocalRuleBasedAIService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("dev")
class AIServiceTest {

    @Autowired
    private LocalRuleBasedAIService localAIService;

    @Test
    void testWaterReminderChatIntent() {
        AIChatRequest request = AIChatRequest.builder()
                .prompt("Remind me to drink water every 15 minutes")
                .accountabilityMode("BALANCED")
                .build();

        AICoachResponse response = localAIService.processChat(request);

        Assertions.assertNotNull(response);
        Assertions.assertEquals("DRINKING", response.getAnimationState());
        Assertions.assertTrue(response.getMessage().contains("hydrated"));
    }
}
