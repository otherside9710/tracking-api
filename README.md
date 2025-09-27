# Tracking API

API REST para el seguimiento de envíos, implementada con Clean Architecture y TypeScript.

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
Implementamos conceptos clave de DDD:
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
- `POST /token`
  - Get JWT token for API access
  - Body: `{ "username": "user@email.com", "password": "******" }`

#### Tracking
- `POST /tracking/checkpoints`
  - Register new checkpoint
  - Auth required
  - Body: `{ "unitId": "123", "status": "DELIVERED", "location": "..." }`

- `GET /tracking/units/{id}/history`
  - Get tracking history
  - Auth required
  - Returns: Array of checkpoints

- `GET /tracking/units`
  - List units by status
  - Auth required
  - Query: `?status=IN_TRANSIT`


## 🚦 Uso

### Desarrollo

```bash
npm run dev
```

### Producción

```bash
npm run build
npm start
```

### Tests

```bash
npm test                 # Ejecutar todos los tests
npm run test:watch      # Modo watch
npm run test:coverage   # Cobertura
```

## 🔄 Endpoints

> ⚠️ **Nota**: Todos los endpoints requieren autenticación JWT en el header `Authorization: Bearer <token>`

### Autenticación

#### POST /oauth/token
Obtiene un token de acceso usando credenciales de usuario.

```json
{
  "username": "prueba@coordinadora.com",
  "password": "BFASDASer@dvhd3ysJ@r81"
}
```

Respuesta:
```json
{
  "access_token": "eyJhbGc...",
  "expires_in": 3600,
  "token_type": "Bearer"
}
```

### Checkpoints

#### POST /api/v1/checkpoints
Registra un nuevo checkpoint para una unidad.

```json
{
  "unitId": "string",
  "trackingId": "string",
  "status": "string",
  "timestamp": "string",
  "location": "string",
  "description": "string"
}
```

#### GET /api/v1/tracking/:trackingId
Obtiene el historial de tracking para un ID específico.

#### GET /api/v1/shipments
Lista unidades por estado.

Query params:
- \`status\`: Filtrar por estado (opcional)

## 🔐 Seguridad y Autenticación

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

## � Monitoreo de Errores

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

## Author
Made with 🫶 by [Julio Sarmiento](https://github.com/otherside9710)