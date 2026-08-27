# AI Desktop Companion — Personal AI Friend, Accountability Coach & Virtual Desktop Companion

> **"Help me become a better version of myself every day."**

An animated virtual female desktop companion that lives in the bottom-right corner of your desktop. She acts as a personal AI friend, productivity coach, accountability partner, interactive reminder system, and habit tracker.

---

## 🌟 Resume Bullet Point
> **Built an AI-powered desktop productivity companion using Java Spring Boot, Next.js, Electron, and PostgreSQL that combines intelligent reminders, goal management, focus tracking, behavioral analytics, personalized AI coaching, and an animated virtual desktop companion.**

---

## 🚀 Tech Stack Summary

### Frontend & Web UI
- **Framework**: Next.js 14, React 18, TypeScript
- **Styling**: Vanilla Tailwind CSS + Custom CSS Animations
- **State Management**: Zustand
- **Icons & UI**: Lucide React, Radix UI

### Backend Engineering
- **Language & Framework**: Java 21 / 17, Spring Boot 3.2
- **Persistence**: Spring Data JPA / Hibernate
- **Database**: PostgreSQL (Production) with automatic H2 in-memory zero-setup fallback for instant local execution
- **Security**: Spring Security + JWT Architecture Stateless REST APIs

### Desktop Shell
- **Shell**: Electron 29
- **Features**: Frameless transparent overlay, bottom-right positioning, system tray context menu, startup launch (`auto-launch`), power monitor (idle, screen lock/unlock, sleep/resume)

### AI Architecture & Provider Abstraction
- **Local Rule-Based AI Engine (Default)**: Guarantees **100% free offline execution** out of the box with zero API key dependencies. Handles natural language parsing, priority suggestions, task breakdowns, and coaching responses.
- **Configurable Adapters**: Pluggable adapters for OpenAI (GPT-4o) and local Ollama models.

---

## 🛠️ System Architecture

```
+------------------------------------------------------------------------------------+
|                               ELECTRON DESKTOP SHELL                               |
|                                                                                    |
|  +-----------------------------------+     +------------------------------------+  |
|  |     Companion Overlay Window      |     |        Dashboard Main Window       |  |
|  | (Frameless, Transparent, Topmost) |     |  (Full feature dashboard, stats)   |  |
|  |   Next.js View / Companion UI     |     |       Next.js App / Desktop        |  |
|  +-----------------------------------+     +------------------------------------+  |
|                   \                                     /                          |
|                    +-----------------+-----------------+                           |
|                                      | IPC                                         |
|                           +---------------------+                                  |
|                           | Electron Main Process|                                 |
|                           | System Tray, Auto-  |                                  |
|                           | Launch, Power Monitor|                                 |
|                           +----------+----------+                                  |
+--------------------------------------|---------------------------------------------+
                                       | HTTP / REST (JWT Auth)
                                       v
+------------------------------------------------------------------------------------+
|                            SPRING BOOT 3 BACKEND SERVER                            |
|                                                                                    |
|  +-------------------+  +--------------------+  +-------------------------------+  |
|  | REST Controllers  |  |  Task Scheduler    |  |       AI Abstraction          |  |
|  | (Tasks, Goals,    |  |  (Reminders &      |  |  (Local Mock / OpenAI /       |  |
|  |  Reminders, Focus)|  |   Focus Timers)    |  |   Ollama Provider Adapters)   |  |
|  +---------+---------+  +---------+----------+  +---------------+---------------+  |
|            |                      |                             |                  |
|            v                      v                             v                  |
|  +------------------------------------------------------------------------------+  |
|  |                             Service & Domain Layer                           |  |
|  +----------------------------------------+-------------------------------------+  |
|                                           | Spring Data JPA                        |
|                                           v                                        |
|  +------------------------------------------------------------------------------+  |
|  |                           PostgreSQL / H2 Database                            |  |
|  +------------------------------------------------------------------------------+  |
+------------------------------------------------------------------------------------+
```

---

## ⚡ Quick Start & Running Locally

### 1. Spring Boot Backend
Navigate to the `backend/` directory:
```bash
cd backend
# Run Spring Boot (Uses dev profile with zero-setup H2 database)
./mvnw spring-boot:run
```
*Backend runs on `http://localhost:8080`*

### 2. Desktop Application & Next.js Frontend
Navigate to the `desktop/` directory:
```bash
cd desktop
# Install dependencies
npm install

# Run dev mode (Starts Next.js dev server & launches Electron desktop shell)
npm run dev:electron
```

---

## 📄 Documentation Links
- [ARCHITECTURE.md](file:///d:/Reminder/ARCHITECTURE.md): Desktop shell IPC, state machine, and backend layer design.
- [API.md](file:///d:/Reminder/API.md): Complete Spring Boot REST API reference endpoints.
- [DATABASE.md](file:///d:/Reminder/DATABASE.md): Relational database schema, JPA entities, and indexes.
- [AI.md](file:///d:/Reminder/AI.md): AI abstraction layer, heuristic rules, and memory architecture.
