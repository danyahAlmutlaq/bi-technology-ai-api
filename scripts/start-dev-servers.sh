#!/bin/bash
exec 200>/tmp/ertikaz-dev-servers.lock
flock -n 200 || exit 0
BACKEND_DIR="/workspaces/bi-technology-ai-api/backend"
FRONTEND_DIR="/workspaces/bi-technology-ai-api/frontend/next-frontend"
LOG_DIR="/workspaces/bi-technology-ai-api/scripts/logs"
mkdir -p "$LOG_DIR"
if ! curl -s -o /dev/null http://127.0.0.1:8000/docs; then
  echo "[ertikaz] starting backend..."
  (cd "$BACKEND_DIR" && nohup uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload > "$LOG_DIR/backend.log" 2>&1 200>&- &)
else
  echo "[ertikaz] backend already running"
fi
if ! curl -s -o /dev/null http://127.0.0.1:3000; then
  echo "[ertikaz] starting frontend..."
  (cd "$FRONTEND_DIR" && nohup npm run dev > "$LOG_DIR/frontend.log" 2>&1 200>&- &)
else
  echo "[ertikaz] frontend already running"
fi
if ! pgrep -f "cloudflared tunnel --url http://localhost:3000" > /dev/null; then
  echo "[ertikaz] starting cloudflare tunnel..."
  rm -f "$LOG_DIR/cloudflared.log"
  nohup cloudflared tunnel --url http://localhost:3000 > "$LOG_DIR/cloudflared.log" 2>&1 200>&- &
  for i in $(seq 1 15); do
    sleep 2
    if grep -q "trycloudflare.com" "$LOG_DIR/cloudflared.log" 2>/dev/null; then
      break
    fi
  done
else
  echo "[ertikaz] cloudflare tunnel already running"
fi
echo "[ertikaz] الرابط العام:"
grep -o "https://[a-zA-Z0-9-]*\.trycloudflare\.com" "$LOG_DIR/cloudflared.log" 2>/dev/null | tail -1
