# ---- ビルドステージ ----
FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /app
COPY pom.xml .
# 依存関係だけ先にキャッシュ（ソース変更時の再ビルドを高速化）
RUN mvn dependency:go-offline -q
COPY src ./src
RUN mvn package -DskipTests -q

# ---- 実行ステージ ----
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar

# 環境変数のデフォルト値（EC2 起動時に上書きする）
ENV DB_HOST=localhost \
    DB_PORT=5432 \
    DB_NAME=taskmanagement \
    DB_USER=postgres \
    DB_PASSWORD=postgres \
    SERVER_PORT=8080

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
