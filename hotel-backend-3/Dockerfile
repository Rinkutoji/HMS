# syntax=docker/dockerfile:1.4
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app

# Step 1: Copy dependency definitions only
COPY pom.xml .

# Step 2: Download dependencies (cached until pom.xml changes)
RUN --mount=type=cache,target=/root/.m2 \
    mvn dependency:go-offline -B

# Step 3: Copy actual source code
COPY src ./src

# Step 4: Build application (uses cached dependencies from Step 2)
RUN --mount=type=cache,target=/root/.m2 \
    mvn package -DskipTests -B

# Step 5: Runtime stage
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
