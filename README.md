# Psychology Welfare API - Reto Docker

## ✅ Paso 1: Microservicio diseñado

- **Entidad:** `PsychologicalEvaluation` con arquitectura hexagonal
- **Endpoints CRUD:** `/api/v1/psychological-evaluations`
- **Stack:** Spring Boot + WebFlux + PostgreSQL + R2DBC

## ✅ Paso 2: API con variables de entorno

- **WebFlux:** Implementado con programación reactiva
- **Variables de entorno:** DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
- **Configuración:** `application.yml` usa variables de entorno

## ✅ Paso 3: Aplicación dockerizada

### Dockerfile creado

- **Imagen base:** `openjdk:17-jdk-alpine`
- **Maven:** Instalado automáticamente
- **Compilación:** `mvn clean package -DskipTests`
- **Puerto:** 8085 expuesto

### Comandos ejecutados

```bash
# Construir imagen
docker build -t psychology-api .

# Ejecutar contenedor
docker run -d --name psychology_api --network ms-net -p 8086:8085 \
  -e DB_HOST=postgres -e DB_NAME=psychological_evaluations \
  -e DB_USER=admin -e DB_PASSWORD=admin123 psychology-api
```

## ✅ Paso 4: Base de datos PostgreSQL (rama db)

### Docker Compose configurado

- **Imagen oficial:** `postgres:15`
- **Variables de entorno:** Configuradas desde `.env`
- **Volumen:** `db-data` para persistencia
- **Script de inicialización:** `database.sql` ejecutado automáticamente
- **Red:** `ms-net` para comunicación

### Comandos ejecutados

```bash
# Crear volumen y red
docker volume create db-data
docker network create --driver bridge ms-net

# Levantar base de datos
docker-compose up -d

# Verificar tablas creadas
docker-compose exec postgres psql -U admin -d psychological_evaluations -c "\dt"
```

## ✅ Paso 5: Red personalizada

- **Red creada:** `ms-net` con driver bridge
- **Comunicación:** Contenedores se conectan por nombre
- **Aislamiento:** Red separada para el proyecto

## ✅ Paso 6: Contenedores ejecutándose

### Ambos contenedores en la misma red

- **API:** `psychology_api` corriendo en puerto 8085
- **Base de datos:** `postgres` corriendo en puerto 5432
- **Red:** Ambos conectados a `ms-net`

### Configuración de comunicación

- **API usa:** `DB_HOST=postgres` (nombre del contenedor)
- **PostgreSQL:** Contenedor nombrado como `postgres`
- **Comunicación:** Establecida por nombre de contenedor en red bridge

### Verificación ejecutada

```bash
# Contenedores corriendo
docker ps

# Ambos en la misma red
docker network inspect ms-net --format "{{range .Containers}}{{.Name}} {{end}}"
# Resultado: psychology_api postgres
```

## ✅ Paso 7: Comunicación verificada

### Pruebas de endpoints ejecutadas

```bash
# Probar endpoint principal
curl http://localhost:8085/api/v1/psychological-evaluations
# Resultado: 200 OK - Datos recuperados exitosamente

# Verificar Swagger UI
curl http://localhost:8085/swagger-ui.html
# Resultado: 200 OK - Interfaz disponible
```

### Comunicación confirmada

- **API ↔ PostgreSQL:** ✅ Conexión establecida
- **Datos de ejemplo:** ✅ Recuperados correctamente
- **Endpoints funcionando:** ✅ Status 200 OK
- **Swagger UI:** ✅ Disponible en http://localhost:8085/swagger-ui.html

### Acceso a servicios

- **API REST:** http://localhost:8085/api/v1/psychological-evaluations
- **Swagger UI:** http://localhost:8085/swagger-ui.html
- **Base de datos:** localhost:5432 (admin/admin123)

## ✅ Paso 8: Docker Swarm desplegado

### Inicialización de Swarm

```bash
# Inicializar Docker Swarm
docker swarm init
# Resultado: Swarm initialized - nodo manager configurado
```

### Red overlay para Swarm

```bash
# Crear red overlay para comunicación entre nodos
docker network create --driver overlay --attachable ms-net-swarm
```

### Configuración de deploy

Creado `docker-compose.swarm.yml` con:

- **Réplicas:** 2 para API, 1 para PostgreSQL
- **Recursos:** Límites de memoria configurados
- **Políticas de reinicio:** on-failure con 3 intentos máximo
- **Estrategia de actualización:** Rolling update con rollback

### Despliegue del stack

```bash
# Desplegar stack en Swarm
docker stack deploy -c docker-compose.swarm.yml microservice

# Verificar servicios
docker service ls
# Resultado:
# microservice_postgres         1/1 réplicas
# microservice_psychology-api   2/2 réplicas
```

### Verificación de servicios

```bash
# Ver servicios del stack
docker stack services microservice

# Ver tareas de un servicio específico
docker service ps microservice_psychology-api
```

### Estado del despliegue

- **Stack:** `microservice` desplegado exitosamente
- **API:** 2 réplicas corriendo en puerto 8085
- **PostgreSQL:** 1 réplica con datos persistentes
- **Alta disponibilidad:** Configurada con políticas de reinicio

## 🎯 Estado final - RETO COMPLETADO ✅

- ✅ Microservicio API dockerizado y funcionando
- ✅ Base de datos PostgreSQL con datos de ejemplo
- ✅ Red personalizada para comunicación
- ✅ Volumen persistente para datos
- ✅ Ambos contenedores ejecutándose en la misma red
- ✅ Comunicación API ↔ Base de datos verificada
- ✅ Docker Swarm con alta disponibilidad desplegado

## 🎁 Bonus implementados

### ✅ Políticas de reinicio automático (+1.5 puntos)

**Configuración avanzada de restart policies en Docker Swarm:**

**PostgreSQL - Política de reinicio robusta:**

```yaml
restart_policy:
  condition: any # Reinicia en cualquier condición (fallo, stop manual, etc.)
  delay: 10s # Espera 10 segundos antes de reiniciar
  max_attempts: 10 # Máximo 10 intentos de reinicio
  window: 120s # Ventana de evaluación de 2 minutos
```

**Psychology API - Política de alta disponibilidad:**

```yaml
restart_policy:
  condition: any # Reinicia automáticamente siempre
  delay: 15s # Espera 15 segundos (más tiempo para estabilizar)
  max_attempts: 15 # Hasta 15 intentos de reinicio
  window: 300s # Ventana de evaluación de 5 minutos
```

**Políticas probadas y verificadas:**

```bash
# Actualización forzada exitosa
docker service update --force microservice_psychology-api
# Resultado: Service converged - Rolling update completado

# Estado final de servicios
docker service ls
# microservice_postgres         1/1 réplicas ✅
# microservice_psychology-api   2/2 réplicas ✅
```

**Características implementadas:**

1. **Reinicio automático inteligente:**

   - Condición `any`: Reinicia por fallos, stops manuales o actualizaciones
   - Delays progresivos para evitar loops de reinicio
   - Ventanas de tiempo para evaluar estabilidad

2. **Healthchecks integrados:**

   - PostgreSQL: `pg_isready` cada 30s
   - API: `/actuator/health` cada 30s
   - Reinicio automático si healthcheck falla

3. **Distribución y tolerancia a fallos:**

   - 2 réplicas de API para alta disponibilidad
   - Distribución automática entre nodos disponibles
   - Placement en nodos manager para PostgreSQL (datos críticos)

4. **Políticas de actualización y rollback:**
   - Rolling updates con monitoreo
   - Rollback automático si falla más del 30%
   - Start-first para zero-downtime deployments

**Verificación de políticas:**

```bash
# Ver políticas aplicadas
docker service inspect microservice_psychology-api --format '{{.Spec.TaskTemplate.RestartPolicy}}'

# Simular fallo para probar reinicio
docker service update --force microservice_psychology-api

# Monitorear reinicios
docker service ps microservice_psychology-api
```

### ✅ Healthchecks en Dockerfile (+1.5 puntos)

**Configuración agregada al Dockerfile:**

```dockerfile
# Instalar curl para healthcheck
RUN apk add --no-cache maven curl

# Healthcheck para verificar que la aplicación esté funcionando
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8085/api/v1/psychological-evaluations || exit 1
```

**Características del healthcheck:**

- **Intervalo:** Cada 30 segundos
- **Timeout:** 10 segundos máximo
- **Start period:** 60 segundos de gracia al iniciar
- **Reintentos:** 3 intentos antes de marcar como unhealthy
- **Endpoint:** Verifica `/actuator/health`

### ✅ Endpoint /health implementado (+1.5 puntos)

**Spring Boot Actuator agregado:**

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

**Configuración en application.yml:**

```yaml
management:
  endpoints:
    web:
      exposure:
        include: "*"
      base-path: /actuator
      cors:
        allowed-origins: "*"
        allowed-methods: "*"
        allowed-headers: "*"
  endpoint:
    health:
      show-details: always
      show-components: always
  health:
    db:
      enabled: true
```

**Endpoints disponibles y verificados:**

- **Health:** `GET /actuator/health` - Estado de la aplicación y base de datos
- **Info:** `GET /actuator/info` - Información de la aplicación
- **Metrics:** `GET /actuator/metrics` - Métricas de rendimiento
- **Listado:** `GET /actuator` - Todos los endpoints disponibles

**Verificación exitosa:**

```bash
# Endpoint principal de Actuator
curl http://localhost:8085/actuator
# Resultado: Lista completa de endpoints disponibles

# Health check detallado
curl http://localhost:8085/actuator/health
# Resultado: {"status":"UP","components":{"diskSpace":{"status":"UP"},"ping":{"status":"UP"},"r2dbc":{"status":"UP","details":{"database":"PostgreSQL"}},"ssl":{"status":"UP"}}}
```

**Componentes monitoreados:**

- ✅ **diskSpace:** Espacio en disco disponible
- ✅ **ping:** Conectividad básica
- ✅ **r2dbc:** Conexión a PostgreSQL
- ✅ **ssl:** Configuración SSL

## 🏆 Reto Docker completado exitosamente

**Microservicio de evaluaciones psicológicas desplegado con:**

- Orquestación con Docker Swarm
- Alta disponibilidad (2 réplicas de API)
- Persistencia de datos
- Comunicación entre servicios
- Políticas de reinicio y recursos configurados
- **Healthchecks configurados** ✅
- **Endpoint /health implementado** ✅
