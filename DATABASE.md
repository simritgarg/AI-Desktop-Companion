# Database Schema Specification

The backend uses relational persistence via **Spring Data JPA** targeting **PostgreSQL** in production with an **H2** fallback in development mode.

## Relational Tables

### 1. `app_users`
- `id` (BIGINT PRIMARY KEY AUTO_INCREMENT)
- `username` (VARCHAR UNIQUE)
- `email` (VARCHAR)
- `password` (VARCHAR)
- `accountability_mode` (VARCHAR) — `FRIENDLY`, `BALANCED`, `STRICT`, `NO_EXCUSES`
- `personality` (VARCHAR) — `BEST_FRIEND`, `COACH`, `STUDY_BUDDY`, `STRICT_MENTOR`
- `companion_name` (VARCHAR)
- `xp` (INT), `level` (INT), `streak_days` (INT)
- `created_at` (TIMESTAMP)

### 2. `goals`
- `id` (BIGINT PRIMARY KEY AUTO_INCREMENT)
- `title` (VARCHAR)
- `description` (TEXT)
- `goal_type` (VARCHAR) — `LONG_TERM`, `MEDIUM_TERM`, `SHORT_TERM`
- `target_date` (DATE)
- `status` (VARCHAR) — `IN_PROGRESS`, `COMPLETED`, `CANCELLED`
- `parent_goal_id` (BIGINT)
- `progress_percentage` (INT)

### 3. `tasks`
- `id` (BIGINT PRIMARY KEY AUTO_INCREMENT)
- `title` (VARCHAR)
- `description` (TEXT)
- `priority` (VARCHAR) — `LOW`, `MEDIUM`, `HIGH`, `URGENT`
- `estimated_minutes` (INT), `actual_minutes` (INT)
- `status` (VARCHAR) — `TODO`, `IN_PROGRESS`, `COMPLETED`, `SKIPPED`
- `due_date` (TIMESTAMP)
- `goal_id` (BIGINT)
- `is_top_priority` (BOOLEAN)

### 4. `reminders`
- `id` (BIGINT PRIMARY KEY AUTO_INCREMENT)
- `title` (VARCHAR)
- `reminder_type` (VARCHAR) — `TIME_BASED`, `RECURRING`, `HABIT`, `CONTEXT_AWARE`, `GOAL_BASED`
- `scheduled_at` (TIMESTAMP)
- `recurrence_cron` (VARCHAR)
- `animation_type` (VARCHAR) — `DRINKING`, `STUDYING`, `STRETCHING`, `CELEBRATING`, `GREETING`
- `is_active` (BOOLEAN)

### 5. `focus_sessions`
- `id` (BIGINT PRIMARY KEY AUTO_INCREMENT)
- `session_type` (VARCHAR) — `POMODORO`, `DEEP_WORK`, `CUSTOM`
- `target_duration_minutes` (INT), `actual_focus_minutes` (INT)
- `distraction_count` (INT)
- `status` (VARCHAR) — `IN_PROGRESS`, `COMPLETED`, `INTERRUPTED`
- `started_at` (TIMESTAMP), `ended_at` (TIMESTAMP)

### 6. `daily_statistics`
- `id` (BIGINT PRIMARY KEY AUTO_INCREMENT)
- `date` (DATE UNIQUE)
- `total_active_minutes` (INT), `total_focus_minutes` (INT), `distracted_minutes` (INT)
- `tasks_completed` (INT), `water_intake_count` (INT)
