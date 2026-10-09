@echo off
TITLE AI Desktop Companion - Launcher
echo ========================================================
echo         AI DESKTOP COMPANION - STARTUP SCRIPT
echo ========================================================
echo.

echo [1/2] Starting Java Spring Boot Backend Server (Port 8080)...
start "AI Companion Backend" cmd /k "cd /d %~dp0backend && mvn spring-boot:run"

echo [2/2] Launching Next.js UI & Electron Desktop Companion...
start "AI Companion Desktop App" cmd /k "cd /d %~dp0desktop && npm run dev:electron"

echo.
echo ========================================================
echo  Both services launched! 
echo  - Backend API: http://localhost:8080
echo  - Web Dashboard: http://localhost:3000
echo  - Desktop Shell: Bottom-Right Screen Overlay
echo ========================================================
