#!/bin/bash
exec 200>/tmp/ertikaz-dev-servers.lock
flock -n 200 || exit 0
BACKEND_DIR="/workspaces/bi-technology-ai-api/backend"
FRONTEND_DIR="/workspaces/bi-technology-ai-api/frontend/next-frontend"
LOG_DIR="/workspaces/bi-technology-ai-api/scripts/logs"
mkdir -p "$LOG_DIR"
if ! curl -s -o /dev/null http://127.0.0.1:8000/docs; then
  echo "[ertikaz] starting backend..."
  (cd "$BACKEND_DIR" && nohup uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload > "$LOG_DIR/backend.log" 2>&1 &)
else
  echo "[ertikaz] backend already running"
fi
if ! curl -s -o /dev/null http://127.0.0.1:3000; then
  echo "[ertikaz] starting frontend..."
  (cd "$FRONTEND_DIR" && nohup npm run dev > "$LOG_DIR/frontend.log" 2>&1 &)
else
  echo "[ertikaz] frontend already running"
fi
