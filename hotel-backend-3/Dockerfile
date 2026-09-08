# syntax=docker/dockerfile:1

FROM maven:3.9-eclipse-temurin-25 AS build

WORKDIR /workspace

COPY pom.xml .
RUN mvn -B -DskipTests dependency:go-offline

COPY src ./src
RUN mvn -B -DskipTests package

FROM eclipse-temurin:25-jre

WORKDIR /app

RUN mkdir -p /app/uploads \
    && useradd --system --uid 10001 --create-home appuser \
    && chown -R appuser:appuser /app

COPY --from=build --chown=appuser:appuser /workspace/target/*.jar /app/app.jar

USER appuser

ENV SPRING_PROFILES_ACTIVE=prod \
    SERVER_PORT=8080 \
    APP_UPLOAD_BASE_DIR=/app/uploads

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
