#!/bin/bash
set -e

BUCKET="taskmanagement-frontend-237228997080"
DB_PASSWORD="2NAZDTrkULo2GYbQBGmjCpjj"

# Java 21 インストール
dnf install -y java-21-amazon-corretto-headless

# アプリディレクトリ準備
mkdir -p /app
cd /app

# S3 から jar をダウンロード
aws s3 cp s3://${BUCKET}/backend/app.jar /app/app.jar

# PostgreSQL が起動するまで待機（最大60秒）
for i in $(seq 1 12); do
  if docker ps 2>/dev/null | grep -q taskmanagement-postgres; then
    echo "PostgreSQL is running"
    break
  fi
  echo "Waiting for PostgreSQL... ($i/12)"
  sleep 5
done

# systemd サービスファイル作成
cat > /etc/systemd/system/taskmanagement.service << UNIT
[Unit]
Description=Task Management Spring Boot App
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/app
Environment=SPRING_PROFILES_ACTIVE=prod
Environment=DB_HOST=localhost
Environment=DB_PORT=5432
Environment=DB_NAME=taskmanagement
Environment=DB_USER=postgres
Environment=DB_PASSWORD=${DB_PASSWORD}
ExecStart=/usr/bin/java -jar /app/app.jar
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
UNIT

systemctl daemon-reload
systemctl enable taskmanagement
systemctl start taskmanagement

echo "=== Setup complete ==="
systemctl status taskmanagement --no-pager
