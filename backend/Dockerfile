# Stage 1: Build
FROM gradle:8.8-jdk17 AS build
WORKDIR /app

# Copy Gradle files
COPY gradlew .
COPY gradle ./gradle
COPY build.gradle .
COPY settings.gradle .

# Copy source code & lib
COPY src ./src
COPY lib ./lib

# Build project
RUN ./gradlew clean build -x test

# Stage 2: Run
FROM eclipse-temurin:17-jdk
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
