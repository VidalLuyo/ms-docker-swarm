# Stage 1: build con Maven dentro del contenedor
FROM maven:3.9.5-eclipse-temurin-17 AS builder
WORKDIR /workspace
COPY pom.xml .
COPY src ./src
RUN mvn -B -DskipTests package

# Stage 2: runtime ligero
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
ENV SERVER_PORT=8085
EXPOSE 8085
COPY --from=builder /workspace/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "/app/app.jar"]