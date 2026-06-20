#!/bin/bash
# start-test-servers.sh - Start dev servers for all 3 worktrees
set -e
pkill -f "vite --port 518" 2>/dev/null || true
sleep 2

mkdir -p /tmp/e2e-servers

(npx vite --port 5181 --strictPort > /tmp/e2e-servers/issue18.log 2>&1 &)
(npx vite --port 5182 --strictPort > /tmp/e2e-servers/issue19.log 2>&1 &)
(npx vite --port 5183 --strictPort > /tmp/e2e-servers/issue20.log 2>&1 &)

echo "Waiting for servers to start..."
sleep 6

for PORT in 5181 5182 5183; do
  STATUS=$(curl -sI "http://localhost:$PORT/" 2>&1 | head -1)
  echo "Port $PORT: $STATUS"
done

echo "All servers started. PIDs:"
pgrep -f "vite --port 518" | head -5
