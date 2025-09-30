#  Tracking API  🔥

API REST para el seguimiento de envíos, implementada con Node TS + Clean Architecture + DDD.

## URL del Servicio

La API está desplegada y disponible en:

```
https://tracking-api-6omx.onrender.com
```

### 🏎️ Endpoints Principales

- Health Check: `GET /health`
- Obtener Token: `POST /api/v1/token`
- Registrar Checkpoint: `POST /api/v1/checkpoints`
- Consultar Tracking: `GET /api/v1/tracking/:trackingNumber`
- Listar Unidades por Estado: `GET /api/v1/shipments?status=IN_TRANSIT`

### Estado del Servicio

Puedes verificar el estado del servicio en cualquier momento accediendo a:
```
https://tracking-api-6omx.onrender.com/health
```

## Despliegue en Render

### Pre-requisitos

1. Tener una cuenta en [Render](https://render.com)
2. Tener el repositorio conectado con Render

### Pasos para el despliegue

1. Ve a tu dashboard en Render
2. Crea un nuevo Web Service y conecta tu repositorio de GitHub
3. Configura el servicio:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

4. Configura las variables de entorno en GitHub Actions (Settings > Secrets > Actions):

   ```yaml
   # Variables requeridas en GitHub Secrets
   LOG_LEVEL: info
   SENTRY_DSN: tu-dsn-de-sentry
   ALLOWED_ORIGINS: "*"
   AUTH0_BASE_URL: tu-auth0-url
   AUTH0_CLIENT_ID: tu-client-id
   AUTH0_CLIENT_SECRET: tu-client-secret
   AUTH0_AUDIENCE: tu-audience
   AUTH0_GRANT_TYPE: tu-grant-type
   RATE_LIMIT_MAX: "100"
   RATE_LIMIT_TIME_WINDOW: "60000"
   RENDER_DEPLOY_HOOK_URL: tu-render-deploy-hook-url
   ```

5. Configura el Deploy Hook en Render:
   - Ve a tu servicio en Render
   - Dashboard > Settings > Deploy Hook
   - Copia la URL del Deploy Hook
   - Agrégala como secreto `RENDER_DEPLOY_HOOK_URL` en GitHub

El despliegue se realizará automáticamente cuando:
- Se hace push a la rama `main`
- Todos los tests pasan correctamente
- El ambiente de producción está configurado en GitHub

El workflow de CI/CD (.github/workflows/deploy.yml) se encarga de:
1. Ejecutar los tests unitarios y de aceptación
2. Si los tests pasan, triggerea el despliegue en Render
3. Render construye y despliega la nueva versión

### Verificación del despliegue

El servicio está desplegado y puedes verificar que está funcionando correctamente accediendo a:

```
https://tracking-api-6omx.onrender.com/health
```

Deberías recibir una respuesta como:
```json
{
  "status": "ok",
  "timestamp": "2025-09-29T22:59:33.179Z"
}
```

### Monitoreo

- El endpoint `/health` es monitoreado automáticamente por Render
- Si el endpoint falla, Render intentará reiniciar el servicio
- Puedes ver los logs en tiempo real desde el dashboard de Render

### Escalado

El plan inicial (starter) incluye:
- 512 MB de RAM
- 0.1 CPU compartido
- Construcción automática desde GitHub
- Certificado SSL automático
- Dominio personalizado de Render

Para escalar, puedes cambiar a planes superiores desde el dashboard de Render.

### Variables de Entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| NODE_ENV | Entorno de ejecución | production |
| PORT | Puerto de la aplicación | 3000 |
| HOST | Host de la aplicación | 0.0.0.0 |
| LOG_LEVEL | Nivel de logging | info |
| ALLOWED_ORIGINS | CORS origins permitidos | * |
| RATE_LIMIT_MAX | Límite máximo de peticiones | 100 |
| RATE_LIMIT_TIME_WINDOW | Ventana de tiempo para rate limit (ms) | 60000 |

## Ejemplos de Uso en Producción

> ⚠️ **Importante**: Usar la URL base: `https://tracking-api-6omx.onrender.com`

### 1. Obtener Token de Autenticación

```bash
curl -X POST https://tracking-api-6omx.onrender.com/api/v1/token \
  -H "Content-Type: application/json" \
  -d '{
    "username": "prueba@coordinadora.com",
    "password": "BFASDASer@dvhd3ysJ@r81"
  }'
```

### 2. Consultar Estado de un Envío

```bash
curl https://tracking-api-6omx.onrender.com/api/v1/tracking/TRK001 \
  -H "Authorization: Bearer tu-token"
```

### 3. Registrar un Nuevo Checkpoint

```bash
curl -X POST https://tracking-api-6omx.onrender.com/api/v1/checkpoints \
  -H "Authorization: Bearer tu-token" \
  -H "Content-Type: application/json" \
  -d '{
    "unitId": "UNIT001",
    "trackingId": "TRK001",
    "status": "IN_TRANSIT",
    "location": "Miami, FL",
    "description": "Paquete en tránsito"
  }'
```

### 4. Listar Envíos por Estado

```bash
curl https://tracking-api-6omx.onrender.com/api/v1/shipments?status=IN_TRANSIT \
  -H "Authorization: Bearer tu-token"
```

## 🏗️ Principios Arquitectónicos

### Clean Architecture
La aplicación está estructurada en capas concéntricas, siguiendo los principios de Clean Architecture de Robert C. Martin:
- **Entities**: Objetos de negocio core (Unit, Checkpoint)
- **Use Cases**: Lógica de aplicación específica
- **Interface Adapters**: Controladores y presentadores
- **Frameworks**: Capa externa con herramientas y frameworks

### SOLID
El código adhiere a los principios SOLID:
- **S**: Single Responsibility - Cada clase tiene una única responsabilidad
- **O**: Open/Closed - Extensible sin modificar código existente
- **L**: Liskov Substitution - Los repositorios son intercambiables
- **I**: Interface Segregation - Interfaces pequeñas y específicas
- **D**: Dependency Inversion - Dependencias hacia abstracciones

### Domain-Driven Design (DDD)
Conceptos clave de DDD:
- **Bounded Contexts**: Separación clara de dominios (tracking, shared)
- **Entities**: Objetos con identidad y ciclo de vida
- **Value Objects**: Objetos inmutables sin identidad
- **Repositories**: Abstracción de persistencia
- **Domain Events**: Para operaciones importantes del dominio
- **Ubiquitous Language**: Terminología consistente en código y documentación

## Arquitectura

El proyecto sigue los principios de Clean Architecture y Domain-Driven Design (DDD), organizando el código en capas y módulos:

### Estructura de Carpetas

```
src/
├── app.ts                 # Configuración de Fastify
├── server.ts             # Punto de entrada
├── config/              # Configuraciones
├── contexts/           # Módulos de dominio
│   ├── shared/        # Código compartido
│   ├── token/         # Gestión de autenticación
│   └── tracking/      # Lógica de seguimiento
└── interfaces/        # Adaptadores HTTP
```

### Capas de la Arquitectura

1. **Domain**: Entidades y reglas de negocio
   - Entities: `Unit`, `Checkpoint`
   - Repositories: `IUnitRepository`, `ICheckpointRepository`

2. **Application**: Casos de uso
   - GetTrackingHistory
   - ListUnitsByStatus
   - RegisterCheckpoint

3. **Infrastructure**: Implementaciones técnicas
   - Repositorios en memoria
   - Servicios de autenticación

4. **Interfaces**: APIs HTTP
   - Controllers: Manejo de requests
   - Routes: Definición de endpoints
   - Validators: Validación de entrada

## 🚀 Características Técnicas

### Core
- **Framework**: Fastify para API REST
- **Lenguaje**: TypeScript con configuración estricta
- **Testing**: Jest para pruebas unitarias y de integración
- **Persistencia**: Repositorios en memoria (extensible a otras implementaciones)

### Seguridad
- **Autenticación**: JWT con Auth0
- **Headers**: Helmet para seguridad HTTP
- **Validación**: JSON Schema para requests
- **CORS**: Configurable por ambiente
- **Rate Limiting**: Protección contra abusos

### Calidad
- **Logging**: Pino para logs estructurados
- **Monitoreo**: Integración con Sentry
- **Linting**: ESLint y Prettier
- **Git Hooks**: Husky para pre-commit
- **Errores**: Manejo centralizado con tipos de dominio

## ⚙️ Configuración

### Requisitos Previos

- Node.js >= 18
- npm o yarn
- Auth0 account y credenciales configuradas

### Variables de Entorno

```env
# Server Configuration
PORT=3000
HOST=0.0.0.0
NODE_ENV=development

# Error Monitoring
SENTRY_DSN=your-sentry-dsn

# Logging
LOG_LEVEL=info

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_TIME_WINDOW=60000

# Auth0 Configuration
AUTH0_BASE_URL=your-auth0-domain
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
AUTH0_AUDIENCE=your-audience
AUTH0_GRANT_TYPE=http://auth0.com/oauth/grant-type/password-realm

# CORS
ALLOWED_ORIGINS=*
```

> 📝 **Nota**: Reemplaza los valores `your-*` con tus propias credenciales.

### 🛠️ Instalación

1. Clonar el repositorio:
\`\`\`bash
git clone [url-del-repositorio]
cd tracking-api
\`\`\`

2. Instalar dependencias:
\`\`\`bash
npm install
\`\`\`

3. Configurar variables de entorno:
\`\`\`bash
cp .env.example .env
\`\`\`

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Tests
npm test

# Producción
npm run build
npm start
```

## 📝 API Reference

### Endpoints

#### Authentication
- `POST /api/v1/token`
  - Get JWT token for API access
  - Body: `{ "username": "prueba@coordinadora.com", "password": "BFASDASer@dvhd3ysJ@r81" }`

#### Tracking
- `POST /api/v1/tracking/checkpoints`
  - Register new checkpoint
  - Auth required
  - Body: `{ "unitId": "123", "status": "DELIVERED", "location": "..." }`

- `GET /api/v1/tracking/units/{id}/history`
  - Get tracking history
  - Auth required
  - Returns: Array of checkpoints

- `GET /api/v1/tracking/units`
  - List units by status
  - Auth required
  - Query: `?status=IN_TRANSIT`


## 🚦 Uso

## Desarrollo Local

Este proyecto usa Docker para desarrollo. Para iniciar:

```bash
# Levantar el servicio con Docker
docker-compose up --build
```

O si prefieres ejecutar directamente con Node:

```bash
# Modo desarrollo con hot-reload
npm run dev

# O para producción
npm run build
npm start
```

### Ejemplos de Uso Local

> ⚠️ **Nota**: Usar la URL base: `http://localhost:3000`

1. Obtener token:
```bash
curl -X POST http://localhost:3000/api/v1/token \
  -H "Content-Type: application/json" \
  -d '{
    "username": "prueba@coordinadora.com",
    "password": "BFASDASer@dvhd3ysJ@r81"
  }'
```

2. Consultar tracking:
```bash
curl http://localhost:3000/api/v1/tracking/TRK001 \
  -H "Authorization: Bearer tu-token"
```

3. Registrar checkpoint:
```bash
curl -X POST http://localhost:3000/api/v1/checkpoints \
  -H "Authorization: Bearer tu-token" \
  -H "Content-Type: application/json" \
  -d '{
    "unitId": "UNIT001",
    "trackingId": "TRK001",
    "status": "IN_TRANSIT",
    "location": "Miami, FL",
    "description": "Paquete en tránsito"
  }'
```

### Tests

```bash
npm test                 # Ejecuta todos los tests
npm run test:unit        # Ejecuta los tests unitatios 
npm run test:acceptance  # Ejecuta los tests de aceptación 
npm run test:coverage    # Ejecuta los tests y muestra la cobertura del código.
```

## 🚦 Endpoints - ejemplos de Uso

> ⚠️ **Nota**: Todos los endpoints requieren autenticación JWT en el header `Authorization: Bearer <token>`

A continuación se muestra el flujo completo para probar los endpoints de la API:

### 1. Obtener Token de Acceso

```bash
# 1. Obtener token de autenticación
curl --request POST \
  --url http://localhost:3000/oauth/token \
  --header 'content-type: application/json' \
  --data '{
    "username": "prueba@coordinadora.com",
    "password": "BFASDASer@dvhd3ysJ@r81"
}'
```

Guarda el token recibido para usarlo en las siguientes peticiones:

```json
{
  "access_token": "eyJhbGc...",
  "expires_in": 3600,
  "token_type": "Bearer"
}
```

### 2. Registrar un Checkpoint

> ⚠️ **Importante**: El sistema tiene las siguientes unidades predefinidas para pruebas:
> - Unit ID: `UNIT001` - Tracking ID: `TRK001`
> - Unit ID: `UNIT002` - Tracking ID: `TRK002`
> - Unit ID: `UNIT003` - Tracking ID: `TRK003`

```bash
# 2. Crear un nuevo checkpoint
curl --request POST \
  --url http://localhost:3000/api/v1/checkpoints \
  --header 'authorization: Bearer eyJhbGc...' \
  --header 'content-type: application/json' \
  --data '{
    "unitId": "UNIT001",
    "trackingId": "TRK001",
    "status": "IN_TRANSIT",
    "location": "Bogotá, Colombia",
    "description": "En ruta hacia destino"
}'
```

### 3. Consultar Historial de Tracking

```bash
# 3. Obtener historial de una unidad
curl --request GET \
  --url http://localhost:3000/api/v1/tracking/TRK789 \
  --header 'authorization: Bearer eyJhbGc...'
```

### 4. Listar Unidades por Estado

```bash
# 4. Listar todas las unidades en tránsito
curl --request GET \
  --url 'http://localhost:3000/api/v1/shipments?status=IN_TRANSIT' \
  --header 'authorization: Bearer eyJhbGc...'
```

> ℹ️ **Nota**: Reemplaza `eyJhbGc...` con el token obtenido en el paso 1.

## �🔐 Seguridad y Autenticación

### Autenticación
La API utiliza Auth0 para la gestión de autenticación. Para obtener un token de acceso:

```bash
curl --request POST \
  --url http://localhost:3000/oauth/token \
  --header 'content-type: application/json' \
  --data '{
    "username": "prueba@coordinadora.com",
    "password": "BFASDASer@dvhd3ysJ@r81"
}'
```

### Usando el Token
Incluye el token JWT en el header Authorization:

```bash
curl -X GET http://localhost:3000/api/v1/shipments \
  -H "Authorization: Bearer your-token-here"
```

> ⚠️ **Nota**: Las credenciales mostradas son solo para propósitos de desarrollo y pruebas.

### Características de Seguridad
- Autenticación JWT
- Rate Limiting
- CORS configurable
- Headers seguros con Helmet
- Manejo de errores de autenticación

## 👀 Monitoreo de Errores

El proyecto utiliza Sentry para el monitoreo y tracking de errores en producción.

### Dashboard de Sentry
- URL: https://jp-developers.sentry.io/issues/?project=4510089284550656
- Usuario: jsarmientop.inca@gmail.com
- Contraseña: trackingapp123

> ⚠️ **Nota de Seguridad**: Estas credenciales son solo para propósitos de este reto tecnico.

### Características del Monitoreo
- Tracking de errores en tiempo real
- Contexto detallado de errores
- Información de la petición HTTP
- Trazas de pila completas
- Segmentación por ambiente (development/production)
- Alertas configurables


## 🧪 Testing

El proyecto incluye:
- Tests unitarios
- Tests de integración
- Cobertura de código

## 📦 Scripts Disponibles

- \`npm run dev\`: Desarrollo con hot-reload
- \`npm run build\`: Compilar TypeScript
- \`npm start\`: Ejecutar versión compilada
- \`npm run lint\`: Ejecutar ESLint
- \`npm run format\`: Formatear código
- \`npm test\`: Ejecutar tests
- \`npm run build:clean\`: Limpiar y reconstruir

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama (\`git checkout -b feature/nueva-caracteristica\`)
3. Commit de cambios (\`git commit -am 'Añadir nueva característica'\`)
4. Push a la rama (\`git push origin feature/nueva-caracteristica\`)
5. Crear un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia UNLICENSED.

## 🤠 Author
Made with 🫶 by [Julio Sarmiento](https://github.com/otherside9710)