#!/bin/bash
# stop-test-servers.sh
pkill -f "vite --port 518" 2>/dev/null || true
echo "Test servers stopped"
