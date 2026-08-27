package com.companion.service.ai;

import com.companion.dto.*;
import com.companion.entity.GoalEntity;
import com.companion.entity.TaskEntity;
import com.companion.repository.GoalRepository;
import com.companion.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service("localAIService")
public class LocalRuleBasedAIService implements AIService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private GoalRepository goalRepository;

    @Override
    public AICoachResponse processChat(AIChatRequest request) {
        String prompt = request.getPrompt() != null ? request.getPrompt().toLowerCase(Locale.ROOT) : "";
        String mode = request.getAccountabilityMode() != null ? request.getAccountabilityMode() : "BALANCED";

        // Natural Language Parsing & Heuristic Intent Matching
        if (prompt.contains("water") || prompt.contains("drink")) {
            return AICoachResponse.builder()
                    .message("Stay hydrated! Clean focus requires a refreshed mind. Grab a glass of water right now 💧")
                    .animationState("DRINKING")
                    .recommendedAction("DRINK_WATER")
                    .actionButtons(List.of("Done", "Remind Me in 15m", "Skip"))
                    .build();
        } else if (prompt.contains("study") || prompt.contains("learn") || prompt.contains("java")) {
            return AICoachResponse.builder()
                    .message("Awesome dedication! You set a goal to master Java & engineering principles. Let's do a 45-minute deep focus study session!")
                    .animationState("STUDYING")
                    .recommendedAction("START_FOCUS")
                    .actionButtons(List.of("Start Focus Session", "Plan Tasks First", "Later"))
                    .build();
        } else if (prompt.contains("wasted") || prompt.contains("procrastinat") || prompt.contains("lazy") || prompt.contains("distract")) {
            String coachMessage = switch (mode) {
                case "FRIENDLY" -> "Don't beat yourself up! Every moment is a chance to reset. Let's start with one 15-minute quick win right now.";
                case "STRICT" -> "You noticed you're off track — that's the first step. Stop switching apps and complete your highest priority task today!";
                case "NO_EXCUSES" -> "You said your career goals matter to you. Excuses won't build your future. Close distracting tabs and start working right now!";
                default -> "It happens to everyone. What matters is how fast you get back on track. Pick one task and give it 25 minutes of deep focus.";
            };
            return AICoachResponse.builder()
                    .message(coachMessage)
                    .animationState("DISAPPOINTED")
                    .recommendedAction("RESET_FOCUS")
                    .actionButtons(List.of("Start 25m Focus", "View Priority Tasks", "Dismiss"))
                    .build();
        } else if (prompt.contains("motivation") || prompt.contains("encourage") || prompt.contains("inspire")) {
            return AICoachResponse.builder()
                    .message("Consistency isn't about giant leaps — it's about showing up every single day. You're building something great!")
                    .animationState("CELEBRATING")
                    .recommendedAction("CELEBRATE")
                    .actionButtons(List.of("Let's Work!", "View Goals"))
                    .build();
        } else if (prompt.contains("what should i do") || prompt.contains("next")) {
            return recommendNextAction();
        }

        // Generic intelligent default response
        return AICoachResponse.builder()
                .message("I'm here with you! Let's stay aligned with your long-term goals and execute your top tasks today.")
                .animationState("TALKING")
                .recommendedAction("CHECK_DASHBOARD")
                .actionButtons(List.of("View Tasks", "Start Focus", "Close"))
                .build();
    }

    @Override
    public TaskBreakdownResponse breakdownGoal(TaskBreakdownRequest request) {
        String title = request.getGoalTitle() != null ? request.getGoalTitle() : "Master Goal";
        List<TaskBreakdownResponse.SubTaskDTO> subtasks = new ArrayList<>();

        if (title.toLowerCase().contains("spring boot") || title.toLowerCase().contains("java")) {
            subtasks.add(new TaskBreakdownResponse.SubTaskDTO("Learn Java & Spring Boot Fundamentals", 45, "HIGH"));
            subtasks.add(new TaskBreakdownResponse.SubTaskDTO("Configure Spring Data JPA & PostgreSQL", 40, "HIGH"));
            subtasks.add(new TaskBreakdownResponse.SubTaskDTO("Build REST API Endpoints with Validation", 60, "HIGH"));
            subtasks.add(new TaskBreakdownResponse.SubTaskDTO("Implement Spring Security & JWT Authentication", 60, "URGENT"));
            subtasks.add(new TaskBreakdownResponse.SubTaskDTO("Write Unit & Integration Tests", 45, "MEDIUM"));
        } else if (title.toLowerCase().contains("job") || title.toLowerCase().contains("career") || title.toLowerCase().contains("interview")) {
            subtasks.add(new TaskBreakdownResponse.SubTaskDTO("Update Resume with High-Impact Projects", 45, "URGENT"));
            subtasks.add(new TaskBreakdownResponse.SubTaskDTO("Solve 2 Medium LeetCode/DSA Problems", 60, "HIGH"));
            subtasks.add(new TaskBreakdownResponse.SubTaskDTO("Apply to 5 Target Companies", 45, "HIGH"));
            subtasks.add(new TaskBreakdownResponse.SubTaskDTO("Review System Design Fundamentals", 45, "MEDIUM"));
        } else {
            subtasks.add(new TaskBreakdownResponse.SubTaskDTO("Research core concepts for: " + title, 30, "HIGH"));
            subtasks.add(new TaskBreakdownResponse.SubTaskDTO("Outline key deliverables & milestone steps", 30, "HIGH"));
            subtasks.add(new TaskBreakdownResponse.SubTaskDTO("Execute Phase 1 implementation", 60, "HIGH"));
            subtasks.add(new TaskBreakdownResponse.SubTaskDTO("Review progress and refine solution", 30, "MEDIUM"));
        }

        return TaskBreakdownResponse.builder()
                .goalTitle(title)
                .subTasks(subtasks)
                .build();
    }

    @Override
    public DailyAnalysisResponse generateDailyAnalysis() {
        List<TaskEntity> completedTasks = taskRepository.findByStatus("COMPLETED");
        List<TaskEntity> todoTasks = taskRepository.findByStatus("TODO");

        int score = completedTasks.size() * 20 + 40;
        if (score > 100) score = 100;

        return DailyAnalysisResponse.builder()
                .summary("You've executed key focus tasks today and maintained steady momentum toward your career milestones.")
                .whatWentWell("Strong focus session adherence during morning hours with high task completion.")
                .whatWentWrong("Occasional app switching and minor task postponement in the afternoon.")
                .patternNoticed("Your highest energy and velocity occurs before 2 PM.")
                .oneThingToChangeTomorrow("Schedule your most complex engineering task as your first priority in the morning.")
                .uncomfortableTruth("Postponing difficult tasks doesn't make them easier — action destroys anxiety.")
                .tomorrowTopPriorities(List.of("Execute highest-priority coding session", "Complete daily habit streak", "Review weekly goal progress"))
                .productivityScore(score)
                .build();
    }

    @Override
    public AICoachResponse recommendNextAction() {
        List<TaskEntity> topTasks = taskRepository.findByIsTopPriorityTrue();
        if (topTasks.isEmpty()) {
            topTasks = taskRepository.findByStatus("TODO");
        }

        if (!topTasks.isEmpty()) {
            TaskEntity target = topTasks.get(0);
            return AICoachResponse.builder()
                    .message("Your highest priority item right now is: '" + target.getTitle() + "'. Let's do a 25-minute focus session on it right now.")
                    .animationState("TALKING")
                    .recommendedAction("START_TASK_" + target.getId())
                    .actionButtons(List.of("Start Now", "Pick Another Task", "Remind Later"))
                    .build();
        }

        return AICoachResponse.builder()
                .message("No active tasks pending! Would you like me to help you set new goals or plan tomorrow's priorities?")
                .animationState("CELEBRATING")
                .recommendedAction("PLAN_DAY")
                .actionButtons(List.of("Plan My Day", "Create Task", "Take a Break"))
                .build();
    }

    @Override
    public boolean isConfigured() {
        return true; // Always active out of the box for free local operation
    }

    @Override
    public String getProviderName() {
        return "Local Heuristic AI Engine (Offline / Free)";
    }
}
