# Tracking API

API de seguimiento construida con Fastify y TypeScript, implementando principios de Clean Architecture, SOLID y Domain-Driven Design (DDD).

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

## 🏗️ Estructura del Proyecto

El proyecto está estructurado siguiendo los principios de Clean Architecture:

```
src/
├── config/                      # Configuración centralizada
│   └── environment.ts          # Variables de entorno tipadas
├── contexts/                    # Contextos de dominio
│   ├── shared/                 # Componentes compartidos
│   │   └── domain/
│   │       └── errors/        # Errores de dominio centralizados
│   └── tracking/              # Contexto principal de tracking
│       ├── domain/            # Reglas de negocio y entidades
│       │   ├── entities/      # Entidades de dominio (Unit, Checkpoint)
│       │   └── repositories/  # Interfaces de repositorios
│       ├── application/       # Casos de uso y DTOs
│       │   ├── dto/          # Objetos de transferencia de datos
│       │   └── use-cases/    # Casos de uso de la aplicación
│       └── infrastructure/    # Implementaciones concretas
│           └── repositories/  # Implementaciones de repositorios
├── interfaces/                  # Adaptadores de interfaz
│   └── tracking/
│       └── http/             # Capa de presentación HTTP
│           ├── controllers/  # Controladores por método HTTP
│           │   ├── GET/     # Controladores para métodos GET
│           │   └── POST/    # Controladores para métodos POST
│           ├── middlewares/ # Middlewares (Auth, Error Handler)
│           ├── routes/     # Definición de rutas
│           └── validators/ # Validadores de esquemas
├── app.ts                      # Configuración de la aplicación
└── server.ts                   # Punto de entrada
```

## 🚀 Características

### Arquitectura y Diseño
- Clean Architecture con capas bien definidas
- Principios SOLID en todo el código
- Domain-Driven Design (DDD)
- Estructura modular por contextos acotados

### Tecnologías
- API RESTful con Fastify
- TypeScript con configuración estricta
- Tests con Jest
- Persistencia en memoria (fácilmente extensible)

### Seguridad y Monitoreo
- Manejo de errores centralizado con DomainError
- Monitoreo de errores con Sentry
- Validación de esquemas
- Logging estructurado con Pino
- CORS configurable
- Rate Limiting
- Headers seguros con Helmet

### Calidad de Código
- Principios SOLID
- Tests unitarios y de integración
- ESLint y Prettier configurados
- Husky para git hooks
- Documentación completa

## 📋 Requisitos

- Node.js >= 18
- npm >= 9

## 🛠️ Instalación

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

## 🔐 Seguridad

La API incluye:
- Autenticación mediante API Key
- Rate Limiting
- CORS configurable
- Headers seguros con Helmet

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

## 📝 API Documentation

```env
PORT=3000
HOST=0.0.0.0
NODE_ENV=development
LOG_LEVEL=info
# Security
API_KEY=your-api-key-here

# Error Monitoring
SENTRY_DSN=your-sentry-dsn
ALLOWED_ORIGINS=*
```

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