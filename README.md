# fri232_T03_ms-docker-swarm

## Esquema de Base de Datos

### Tabla de Evaluaciones Psicológicas

Este microservicio gestiona las evaluaciones psicológicas de estudiantes en instituciones educativas.

#### Tabla: `psychological_evaluations`

| Columna                 | Tipo        | Descripción                    |
| ----------------------- | ----------- | ------------------------------ |
| `id`                    | UUID        | Clave primaria, auto-generada  |
| `student_id`            | UUID        | Referencia al estudiante       |
| `classroom_id`          | UUID        | Referencia al aula             |
| `institution_id`        | UUID        | Referencia a la institución    |
| `evaluation_date`       | DATE        | Fecha de evaluación            |
| `academic_year`         | INT         | Año académico                  |
| `evaluation_type`       | VARCHAR(50) | Tipo de evaluación             |
| `evaluation_reason`     | TEXT        | Motivo de la evaluación        |
| `emotional_development` | VARCHAR(20) | Nivel de desarrollo emocional  |
| `social_development`    | VARCHAR(20) | Nivel de desarrollo social     |
| `cognitive_development` | VARCHAR(20) | Nivel de desarrollo cognitivo  |
| `motor_development`     | VARCHAR(20) | Nivel de desarrollo motor      |
| `observations`          | TEXT        | Observaciones de la evaluación |
| `recommendations`       | TEXT        | Recomendaciones                |
| `requires_follow_up`    | BOOLEAN     | Requiere seguimiento           |
| `follow_up_frequency`   | VARCHAR(30) | Frecuencia de seguimiento      |
| `evaluated_by`          | UUID        | Referencia al evaluador        |
| `evaluated_at`          | TIMESTAMP   | Fecha de creación              |
| `updated_at`            | TIMESTAMP   | Fecha de última actualización  |

## 🐳 Configuración con Docker

### Setup inicial

1. **Crear el volumen para los datos**

   ```bash
   docker volume create db-data
   ```

2. **Crear la red personalizada**

   ```bash
   docker network create --driver bridge ms-net
   ```

   **¿Para qué hice esto?**

   - Creé una red aislada donde solo mis contenedores pueden hablar entre sí
   - Ahora mis contenedores se pueden llamar por nombre (`postgres`) en lugar de IPs raras
   - Mantengo separado mi proyecto de otros que tenga corriendo
   - Era requisito del reto: "Utiliza una red bridge personalizada"

   **¿Por qué elegí bridge?**

   - Es el tipo de red más común y confiable para contenedores
   - Permite que mis servicios se comuniquen directamente
   - Mantiene todo aislado del host y otras redes

3. **Levantar los servicios**
 
   ```bash
   docker-compose up -d
   ```
   **Actualiza**
   ```bash
   docker-compose down
   ```

4. **Verificar que funciona**
   ```bash
   docker-compose ps
   ```

### Configuración

**docker-compose.yml** - Configuración para el reto de orquestación:

✅ **Imagen oficial:** `postgres:15`
✅ **Variables de entorno:** Configuradas desde `.env`
✅ **Volumen externo:** `db-data` (creado manualmente)
✅ **Red personalizada:** `ms-net` (para comunicación entre servicios)

**Características:**

- Usa volumen externo para persistencia de datos
- Red bridge personalizada para comunicación
- Variables de entorno desde archivo `.env`
- Script de inicialización automático
- Preparado para agregar más servicios (API, frontend)

### Conexión a la base de datos

**Desde tu máquina (pgAdmin, DBeaver, etc.):**

```
Host: localhost
Puerto: 5432
Base de datos: psychological_evaluations
Usuario: admin
Contraseña: admin123
```

**Desde otros contenedores (API, microservicios):**

```
Host: postgres
Puerto: 5432
Base de datos: psychological_evaluations
Usuario: admin
Contraseña: admin123
```

**¿Por qué la diferencia?**

- **Desde mi máquina:** Uso `localhost:5432` porque Docker expone el puerto hacia afuera
- **Desde otros contenedores:** Usan `postgres:5432` porque están en mi red interna

**¿Dónde configuré el nombre `postgres`?**

En el `docker-compose.yml`, cuando puse `postgres:` estoy definiendo el nombre del servicio:

```yaml
services:
  postgres: # ← Este nombre lo uso para conectarme desde otros contenedores
    image: postgres:15
    container_name: psychological_evaluations_db # ← Este es solo cosmético para docker ps
    networks:
      - ms-net # ← Lo conecté a mi red personalizada
```

Docker automáticamente hace que `postgres` funcione como hostname dentro de la red.

### Comandos útiles

```bash
# Ver logs de la base de datos
docker-compose logs postgres

# Parar todos los servicios
docker-compose down

# Parar y eliminar volúmenes (cuidado, se pierden los datos)
docker-compose down -v

# Reiniciar un servicio específico
docker-compose restart postgres
```

### 📋 Base de Datos

El script está en [`database.sql`](./database.sql) e incluye:

- Tabla principal con validaciones
- Índices para mejorar performance
- Restricciones de integridad
- 2 registros de ejemplo para testing
- Todo en español

### Testing

Para verificar que los datos se insertaron correctamente:

```bash
# Conectar a la base de datos
docker-compose exec postgres psql -U admin -d psychological_evaluations

# Ver los datos de ejemplo
SELECT student_id, evaluation_type, emotional_development, social_development FROM psychological_evaluations;
```
