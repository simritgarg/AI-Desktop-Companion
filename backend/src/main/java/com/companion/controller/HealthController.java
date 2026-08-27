package com.companion.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.companion.service.ai.AIService;

import java.util.Map;

@RestController
@RequestMapping("/api/health")
@CrossOrigin(origins = "*")
public class HealthController {

    @Autowired
    private AIService aiService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getHealth() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "application", "AI Desktop Companion Backend",
                "aiProvider", aiService.getProviderName(),
                "timestamp", System.currentTimeMillis()
        ));
    }
}
