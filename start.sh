#!/usr/bin/env bash

echo "========================================================"
echo "       Starting Job Portal Web Application"
echo "========================================================"
echo ""

BASEDIR=$(dirname "$0")
cd "$BASEDIR"

echo "[1/2] Launching React Frontend (Vite) on http://localhost:5173..."
cd frontend
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

npm run dev &
FRONTEND_PID=$!

echo "[2/2] Checking Backend environment..."
cd ..
if [ -f "backend/manage.py" ]; then
    echo "Launching Django Backend on http://localhost:8000..."
    python3 backend/manage.py runserver &
    BACKEND_PID=$!
else
    echo "Note: Running in high-fidelity mock service mode."
fi

echo ""
echo "========================================================"
echo "Application running at http://localhost:5173"
echo "Press CTRL+C to stop all services."
echo "========================================================"

trap "kill $FRONTEND_PID $BACKEND_PID 2>/dev/null; exit" SIGINT SIGTERM
wait
