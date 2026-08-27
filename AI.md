# AI Architecture & Abstraction Layer

## 1. Provider Abstraction Architecture (`AIService`)
The application defines a strict provider abstraction layer:

```java
public interface AIService {
    AICoachResponse processChat(AIChatRequest request);
    TaskBreakdownResponse breakdownGoal(TaskBreakdownRequest request);
    DailyAnalysisResponse generateDailyAnalysis();
    AICoachResponse recommendNextAction();
    boolean isConfigured();
    String getProviderName();
}
```

## 2. Zero-Cost Local Heuristic AI Engine (`LocalRuleBasedAIService`)
Out of the box, `LocalRuleBasedAIService` requires **zero paid API keys or external services**.

Key capabilities:
1. **Natural Language Intent Parsing**: Detects keywords like `"water"`, `"study"`, `"wasted afternoon"`, `"motivation"`, `"what should I do now"` and maps them to appropriate companion states, dialogues, and actionable UI buttons.
2. **Accountability Tone Adaptation**: Adjusts tone dynamically based on mode (`FRIENDLY`, `BALANCED`, `STRICT`, `NO_EXCUSES`).
3. **Goal Breakdown Engine**: Automatically breaks complex learning or career goals into structured milestone subtasks.
4. **Behavioral Analysis**: Evaluates focus session counts, task completion ratios, and time patterns to generate daily report insights and identify productivity opportunities.

## 3. Extending with External LLMs
- Set `app.ai.provider: openai` in `application.yml` and set `OPENAI_API_KEY` to activate OpenAI GPT models.
- Set `app.ai.provider: ollama` to use local open-source LLMs (e.g., Llama 3 / Mistral) over HTTP.
