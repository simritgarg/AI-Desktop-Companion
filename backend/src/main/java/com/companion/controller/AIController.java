package com.companion.controller;

import com.companion.dto.*;
import com.companion.service.ai.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AIController {

    @Autowired
    private AIService aiService;

    @PostMapping("/chat")
    public ResponseEntity<AICoachResponse> processChat(@RequestBody AIChatRequest request) {
        return ResponseEntity.ok(aiService.processChat(request));
    }

    @PostMapping("/breakdown")
    public ResponseEntity<TaskBreakdownResponse> breakdownGoal(@RequestBody TaskBreakdownRequest request) {
        return ResponseEntity.ok(aiService.breakdownGoal(request));
    }

    @GetMapping("/analyze-day")
    public ResponseEntity<DailyAnalysisResponse> analyzeDay() {
        return ResponseEntity.ok(aiService.generateDailyAnalysis());
    }

    @GetMapping("/recommend")
    public ResponseEntity<AICoachResponse> recommendNextAction() {
        return ResponseEntity.ok(aiService.recommendNextAction());
    }
}
