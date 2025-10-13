# Psychology Welfare System - Docker Swarm

## ✅ Contenedor Frontend React

**Frontend React con Vite dockerizado y desplegado en Swarm:**

### Características implementadas:

1. **Aplicación React con TypeScript:**

   - Framework: React 19 con Vite
   - Styling: TailwindCSS 4.0
   - Routing: React Router DOM
   - Alertas: SweetAlert2
   - Iconos: Lucide React

2. **Dockerización multi-stage:**

   ```dockerfile
   # Etapa 1: Build con Node.js 20
   FROM node:20-alpine AS builder
   # Etapa 2: Servidor nginx optimizado
   FROM nginx:alpine
   ```

3. **Configuración nginx optimizada:**

   - Proxy reverso para API backend
   - Configuración SPA (Single Page Application)
   - Compresión gzip habilitada
   - Headers de seguridad
   - Cache para archivos estáticos

4. **Despliegue en Docker Swarm:**
   - 2 réplicas para alta disponibilidad
   - Healthchecks integrados
   - Políticas de reinicio automático
   - Balanceador de carga automático

### Servicios desplegados:

```bash
# Estado actual del stack
docker service ls
# microservice_postgres              1/1 réplicas ✅
# microservice_psychology-api        2/2 réplicas ✅
# microservice_psychology-frontend   2/2 réplicas ✅
```

### Acceso a servicios:

- **Frontend React:** http://localhost:3000
- **API Backend:** http://localhost:8085/api/v1/psychological-evaluations
- **Health Check API:** http://localhost:8085/actuator/health
- **Swagger UI:** http://localhost:8085/swagger-ui.html

### Verificación exitosa:

```bash
# Frontend funcionando
curl http://localhost:3000
# Resultado: 200 OK - Aplicación React cargada

# Comunicación frontend → backend via proxy
# nginx.conf configurado para proxy_pass a psychology-api:8085
```

### Arquitectura completa:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   PostgreSQL    │
│   React + Nginx │◄──►│   Spring Boot   │◄──►│   Database      │
│   Port: 3000    │    │   Port: 8085    │    │   Port: 5432    │
│   2 réplicas    │    │   2 réplicas    │    │   1 réplica     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🎯 Comandos de despliegue ejecutados:

```bash
# 1. Construir imagen del frontend
docker build -f Dockerfile.frontend -t psychology-frontend:v2 .

# 2. Desplegar stack completo en Swarm
docker stack deploy -c docker-compose.swarm.yml microservice

# 3. Verificar servicios
docker service ls
docker service ps microservice_psychology-frontend
```

## 🏆 Reto completado exitosamente

**Sistema completo desplegado con:**

- ✅ **Frontend React dockerizado** - Aplicación web moderna
- ✅ **Backend Spring Boot** - API REST con actuator
- ✅ **Base de datos PostgreSQL** - Persistencia de datos
- ✅ **Docker Swarm** - Orquestación y alta disponibilidad
- ✅ **Healthchecks** - Monitoreo automático
- ✅ **Políticas de reinicio** - Recuperación automática
- ✅ **Balanceador de carga** - Distribución de tráfico

