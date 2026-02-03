@echo off
TITLE Enterprise Feedback Intelligence Hub - GLOBAL STARTUP
COLOR 0B

echo ==========================================================
echo    ENTERPRISE FEEDBACK INTELLIGENCE HUB - V5.0
echo ==========================================================
echo.

:: Check for Backend Directory
if not exist "backend" (
    echo [ERROR] Backend directory not found!
    pause
    exit
)

:: Check for Frontend Directory
if not exist "frontend" (
    echo [ERROR] Frontend directory not found!
    pause
    exit
)

echo [1/4] Starting Backend Sentiment Engine (Port 8000)...
start "HUB_BACKEND" cmd /k "cd backend && pip install -r requirements.txt && uvicorn main:app --reload --host 0.0.0.0 --port 8000"

echo [2/4] Waiting for Backend to initialize...
timeout /t 5 /nobreak > nul

echo [3/4] Starting Frontend Strategic Interface (Port 5173)...
start "HUB_FRONTEND" cmd /k "cd frontend && npm install && npm run dev -- --host 0.0.0.0"

echo [4/4] Finalizing System Connectivity...
echo.
echo ==========================================================
echo    SYSTEM STATUS: ACTIVE
echo    STUDENT PORTAL: http://localhost:5173
echo    ADMIN ANALYTICS: http://localhost:5173 (Click Login)
echo    BACKEND API: http://localhost:8000
echo ==========================================================
echo.
echo Press any key to terminate this control window...
pause > nul
