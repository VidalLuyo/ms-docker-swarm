# Usar imagen base con OpenJDK 17 y instalar Maven
FROM openjdk:17-jdk-alpine

# Instalar Maven y curl para healthcheck
RUN apk add --no-cache maven curl

# Información del mantenedor
LABEL maintainer="psychology-welfare-api"

# Crear directorio de trabajo
WORKDIR /app

# Copiar todo el proyecto
COPY . .

# Compilar la aplicación
RUN mvn clean package -DskipTests

# Exponer el puerto 8085
EXPOSE 8085

# Healthcheck para verificar que la aplicación esté funcionando
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8085/actuator/health || exit 1

# Comando para ejecutar la aplicación
CMD ["java", "-jar", "target/vg-ms-psychology-welfare-0.0.1-SNAPSHOT.jar"]