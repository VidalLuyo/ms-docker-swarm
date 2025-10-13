# Psychology Welfare System - Docker Swarm

## 🚀 Guía de Despliegue Completo desde Cero

### Prerrequisitos

- Docker Desktop instalado y funcionando
- Git instalado
- Acceso a terminal/PowerShell

## 🧹 Limpieza Completa (Si ya tienes servicios corriendo)

**⚠️ IMPORTANTE: Ejecuta esta sección SOLO si ya tienes servicios Docker corriendo y quieres empezar desde cero**

```bash
# 1. Verificar si hay stacks corriendo
docker stack ls

# 2. Eliminar el stack si existe
docker stack rm microservice

# 3. Verificar que no hay servicios
docker service ls

# 4. Eliminar redes personalizadas (si existen)
docker network ls
docker network rm ms-net-swarm

# 5. Eliminar volúmenes si existen
docker volume ls
docker volume rm db-data

# 6. Salir del swarm (si está inicializado)
docker swarm leave --force

# 7. Limpiar todo el sistema Docker
docker system prune -a -f

# 8. Verificar que todo está limpio
docker system df
```

**✅ Ahora puedes continuar con el despliegue desde cero**

### Paso 1: Clonar el repositorio y preparar ramas

```bash
# Clonar el repositorio principal
git clone <URL_DEL_REPOSITORIO>
cd fri232_T03_ms-docker-swarm

# Verificar las ramas disponibles
git branch -a

# Cambiar a la rama main (si no estás ya)
git checkout main
```

### Paso 2: Preparar la infraestructura Docker

```bash
# Inicializar Docker Swarm (si no está inicializado)
# Si ya tienes un swarm, primero ejecuta: docker swarm leave --force
docker swarm init

# Crear red overlay para comunicación entre servicios
docker network create --driver overlay --attachable ms-net-swarm

# Crear volumen para persistencia de datos
docker volume create db-data
```

### Paso 3: Preparar la base de datos (rama database)

```bash
# Cambiar a la rama database
git checkout database

# Verificar que existe el archivo database.sql
ls database.sql

# Si no existe, crearlo con la estructura básica
# (El archivo debería estar en la rama database)
```

### Paso 4: Construir imagen del backend (rama backend)

```bash
# Cambiar a la rama backend
git checkout backend

# Construir la imagen del backend Spring Boot
docker build -t psychology-api:v2 .

# Verificar que la imagen se creó correctamente
docker images | grep psychology-api
```

### Paso 5: Construir imagen del frontend (rama frontend)

```bash
# Cambiar a la rama frontend
git checkout frontend

# Construir la imagen del frontend React
docker build -f Dockerfile.frontend -t psychology-frontend:v2 .

# Verificar que la imagen se creó correctamente
docker images | grep psychology-frontend
```

### Paso 6: Volver a main y desplegar el stack completo

```bash
# Volver a la rama main donde está el docker-compose.swarm.yml
git checkout main

# Verificar que tienes el archivo de configuración
ls docker-compose.swarm.yml

# Desplegar todo el stack en Docker Swarm
docker stack deploy -c docker-compose.swarm.yml microservice
```

### Paso 7: Verificar el despliegue

```bash
# Ver el estado de todos los servicios
docker service ls

# Debería mostrar algo como:
# microservice_postgres              1/1 réplicas
# microservice_psychology-api        2/2 réplicas
# microservice_psychology-frontend   2/2 réplicas

# Ver detalles de cada servicio
docker service ps microservice_postgres
docker service ps microservice_psychology-api
docker service ps microservice_psychology-frontend

# Ver logs si hay problemas
docker service logs microservice_postgres
docker service logs microservice_psychology-api
docker service logs microservice_psychology-frontend
```

### Paso 8: Probar la aplicación

```bash
# Probar el frontend
curl http://localhost:3000
# Debería devolver HTML de la aplicación React

# Probar la API backend
curl http://localhost:8085/api/v1/psychological-evaluations
# Debería devolver JSON con datos

# Probar health check
curl http://localhost:8085/actuator/health
# Debería mostrar status: UP

# Probar Swagger UI en el navegador
# http://localhost:8085/swagger-ui.html
```

## 🌐 Acceso a la aplicación

Una vez desplegado exitosamente:

- **🌐 Frontend Web:** http://localhost:3000
- **🔧 API REST:** http://localhost:8085/api/v1/psychological-evaluations
- **📊 Health Check:** http://localhost:8085/actuator/health
- **📚 Documentación API:** http://localhost:8085/swagger-ui.html

## ⚙️ Comandos útiles para gestión

```bash
# Ver servicios corriendo
docker service ls

# Escalar un servicio (ejemplo: más réplicas del frontend)
docker service scale microservice_psychology-frontend=3

# Actualizar un servicio con nueva imagen
docker service update --image psychology-frontend:v3 microservice_psychology-frontend

# Ver logs en tiempo real
docker service logs -f microservice_psychology-api

# Eliminar todo el stack (si necesitas empezar de nuevo)
docker stack rm microservice

# Limpiar recursos no utilizados
docker system prune -f
```

## 🔧 Solución de problemas comunes

0. **Si ya tienes servicios corriendo y quieres empezar desde cero:**

   ```bash
   # Ver la sección "🧹 Limpieza Completa" al inicio del documento
   docker stack rm microservice
   docker swarm leave --force
   docker system prune -a -f
   ```

1. **Error "network not found":**

   ```bash
   docker network create --driver overlay --attachable ms-net-swarm
   ```

2. **Error "volume not found":**

   ```bash
   docker volume create db-data
   ```

3. **Servicios no inician:**

   ```bash
   # Ver logs detallados
   docker service logs microservice_<nombre-servicio>
   ```

4. **Puerto ya en uso:**

   ```bash
   # Ver qué está usando el puerto
   netstat -an | findstr :3000
   netstat -an | findstr :8085
   ```

5. **Reconstruir imágenes si hay cambios:**

   ```bash
   # Backend
   git checkout backend
   docker build -t psychology-api:v2 .

   # Frontend
   git checkout frontend
   docker build -f Dockerfile.frontend -t psychology-frontend:v2 .

   # Redesplegar
   git checkout main
   docker stack deploy -c docker-compose.swarm.yml microservice
   ```

## 📁 Estructura de archivos importantes

```
fri232_T03_ms-docker-swarm/
├── README.md                    # Este archivo (rama main)
├── docker-compose.swarm.yml     # Configuración del stack (rama main)
├── database.sql                 # Script de BD (rama database)
├── Dockerfile                   # Backend (rama backend)
├── Dockerfile.frontend          # Frontend (rama frontend)
├── nginx.frontend.conf          # Configuración nginx (rama frontend)
├── src/                         # Código fuente backend (rama backend)
├── src/                         # Código fuente frontend (rama frontend)
└── pom.xml                      # Dependencias Maven (rama backend)
```

## 🏗️ Arquitectura del sistema

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   PostgreSQL    │
│   React + Nginx │◄──►│   Spring Boot   │◄──►│   Database      │
│   Port: 3000    │    │   Port: 8085    │    │   Port: 5432    │
│   2 réplicas    │    │   2 réplicas    │    │   1 réplica     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
          │                       │                       │
          └───────────────────────┼───────────────────────┘
                                  │
                        ┌─────────────────┐
                        │  Docker Swarm   │
                        │   Orchestrator  │
                        │  ms-net-swarm   │
                        └─────────────────┘
```

## ✅ Características implementadas

- **Frontend React:** Aplicación web moderna con TypeScript y TailwindCSS
- **Backend Spring Boot:** API REST con Spring WebFlux (reactivo)
- **Base de datos PostgreSQL:** Persistencia con R2DBC
- **Docker Swarm:** Orquestación y alta disponibilidad
- **Healthchecks:** Monitoreo automático de servicios
- **Políticas de reinicio:** Recuperación automática ante fallos
- **Balanceador de carga:** Distribución automática de tráfico
- **Proxy reverso:** Nginx configurado para comunicación frontend-backend

## Objetivos obtenidos

- ✅ **Contenedor Frontend React:**
- ✅ **Healthchecks implementados:**
- ✅ **Endpoint /actuator/health:**
- ✅ **Políticas de reinicio automático:**

**¡Con esta guía cualquier persona puede desplegar el sistema completo desde cero en cualquier máquina con Docker!**
