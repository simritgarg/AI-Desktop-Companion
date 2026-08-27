# System Architecture — AI Desktop Companion

## 1. Electron Desktop Shell
The desktop shell runs on Electron 29 with dual `BrowserWindow` instances:

1. **Companion Overlay Window**:
   - `transparent: true`, `frame: false`, `alwaysOnTop: true`, `skipTaskbar: true`.
   - Fixed size (340x420px) anchored at `(screen.width - 360, screen.height - 440)`.
   - Handles animated character poses and dialogue bubbles.

2. **Dashboard Window**:
   - Standard application window for complete goal, task, habit, focus, and analytics management.

3. **System Tray Integration**:
   - Context menu options: `Show Companion`, `Open Dashboard`, `Accountability Mode`, `Always on Top`, `Exit`.

4. **Power Monitor**:
   - Listens to screen locking/unlocking, system sleep, and user idle duration.

---

## 2. Character Animation State Machine
The character system supports 15 poses:
`IDLE`, `WALKING_IN`, `WALKING_OUT`, `GREETING`, `TALKING`, `DRINKING`, `STUDYING`, `TYPING`, `STRETCHING`, `CELEBRATING`, `THINKING`, `DISAPPOINTED`, `SLEEPING`, `MOTIVATIONAL`.

State transitions are managed by the Zustand store (`useCompanionStore`) and rendered smoothly using SVG vector layers in `CharacterCanvas.tsx`.

---

## 3. Spring Boot Backend Architecture
- **Controllers**: Expose RESTful JSON endpoints.
- **Service Layer**: Business logic, goal hierarchy resolution, and scheduler triggers.
- **AI Abstraction (`AIService`)**: Pluggable interface enabling offline zero-cost execution out of the box via `LocalRuleBasedAIService`.
- **Data Persistence**: Spring Data JPA with PostgreSQL / H2 dialect abstraction.
