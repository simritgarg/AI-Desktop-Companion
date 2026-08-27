# REST API Reference — AI Desktop Companion

Base URL: `http://localhost:8080/api`

## Health Check
- `GET /health`: Returns server status, active AI provider, and server timestamp.

## Tasks API
- `GET /tasks`: Retrieve all tasks.
- `POST /tasks`: Create a new task.
- `PUT /tasks/{id}`: Update task fields or mark status (`TODO`, `IN_PROGRESS`, `COMPLETED`, `SKIPPED`).
- `DELETE /tasks/{id}`: Delete task.

## Goals API
- `GET /goals`: Retrieve goal hierarchy.
- `POST /goals`: Create a long-term, medium-term, or short-term goal.
- `PUT /goals/{id}`: Update goal details or progress percentage.
- `DELETE /goals/{id}`: Delete goal.

## Reminders API
- `GET /reminders`: Retrieve active reminders.
- `POST /reminders`: Create a time-based or recurring reminder.
- `POST /reminders/{id}/snooze`: Snooze reminder for requested minutes.
- `POST /reminders/{id}/dismiss`: Dismiss or mark reminder completed.

## Focus Sessions API
- `GET /focus/current`: Get active focus session.
- `POST /focus/start`: Start new Pomodoro / Deep Work focus session.
- `POST /focus/{id}/end`: Finish focus session.
- `POST /focus/{id}/distraction`: Record distraction switch event.

## AI Engine API
- `POST /ai/chat`: Process natural language prompt with active accountability mode.
- `POST /ai/breakdown`: Decompose goal into actionable sub-tasks.
- `GET /ai/analyze-day`: Generate daily productivity analysis report.
- `GET /ai/recommend`: Request highest priority recommendation.
