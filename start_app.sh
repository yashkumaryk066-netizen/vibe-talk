#!/bin/bash

# Kill any existing processes on ports 8000 and 5173 to avoid conflicts
fuser -k 8000/tcp 2>/dev/null
fuser -k 5173/tcp 2>/dev/null

echo "🚀 Starting VibeTalk Backend..."
cd backend
source venv/bin/activate 2>/dev/null || true # Activate venv if it exists
python3 manage.py migrate
python3 manage.py runserver 0.0.0.0:8000 &
BACKEND_PID=$!

echo "🚀 Starting VibeTalk Frontend..."
cd ../frontend
npm install # Ensure dependencies
npm run dev &
FRONTEND_PID=$!

echo "✨ VibeTalk is launching! Access it at: http://localhost:5173"
echo "Press Ctrl+C to stop both servers."

wait $BACKEND_PID $FRONTEND_PID
