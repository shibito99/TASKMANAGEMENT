#!/bin/bash
set -e

# Docker インストール
dnf update -y
dnf install -y docker
systemctl enable docker
systemctl start docker

# Docker Compose インストール
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# SSM Agent は Amazon Linux 2023 にデフォルト搭載済み
systemctl enable amazon-ssm-agent
systemctl start amazon-ssm-agent

# アプリディレクトリ作成
mkdir -p /app

# PostgreSQL を Docker で起動
cat <<EOF > /app/docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:17-alpine
    container_name: taskmanagement-postgres
    environment:
      POSTGRES_DB: ${db_name}
      POSTGRES_USER: ${db_username}
      POSTGRES_PASSWORD: ${db_password}
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
    restart: always

volumes:
  postgres-data:
EOF

cd /app && docker-compose up -d
