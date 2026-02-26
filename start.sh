#!/bin/bash
while true; do
  echo "[runner] Starting server..."
  npm run start
  EXIT_CODE=$?
  echo "[runner] Server exited with code $EXIT_CODE, restarting in 2s..."
  sleep 2
done
