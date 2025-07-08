#!/bin/bash

PORT=${PORT:-3000}

echo "🔄 Membebaskan port $PORT jika sedang digunakan..."
PID=$(lsof -ti tcp:$PORT)
if [ -n "$PID" ]; then
  kill -9 $PID
  echo "✅ Port $PORT telah dibebaskan."
fi

echo "🚀 Menjalankan server menggunakan nodemon..."
npx nodemon server.js