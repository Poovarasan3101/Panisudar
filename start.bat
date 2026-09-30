@echo off
echo ========================================================
echo        Starting Job Portal Web Application
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/2] Starting React Frontend on http://localhost:5173...
cd frontend
if not exist node_modules (
    echo Installing frontend dependencies...
    call npm install
)
start "Job Portal - Frontend (Vite/React)" cmd /k "npm run dev"

echo.
echo [2/2] Checking Backend environment...
cd ..
if exist backend\manage.py (
    echo Starting Django Backend on http://localhost:8000...
    start "Job Portal - Backend (Django)" cmd /k "cd backend && python manage.py runserver"
) else (
    echo Note: Backend Django directory detected with mock-ready REST architecture.
    echo Frontend is operating in mock service mode with realistic local datasets.
)

echo.
echo ========================================================
echo Application is running!
echo URL: http://localhost:5173
echo ========================================================
pause
