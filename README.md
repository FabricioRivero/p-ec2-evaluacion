# 🚀 Simulador de Descargas Concurrentes

**SIS-113 Programación Orientada a Objetos | EC3**  
**Estudiante:** Fabricio Rivero  
**Fecha:** Junio 2026

Sistema de simulación de descargas concurrentes con Worker Threads, DDD, API REST y frontend Vue 3.

---

## 📋 Descripción

Sistema que simula la descarga de archivos desde diferentes fuentes (HTTP, FTP, Mock) procesándolos de manera concurrente usando Worker Threads de Node.js. Expone una API REST documentada con Swagger y sigue principios de Domain-Driven Design (DDD).

El frontend Vue 3 permite interactuar visualmente con el sistema en tiempo real mediante polling cada 2 segundos.

---

## 🛠️ Stack Tecnológico

### Backend
- **Node.js + TypeScript** — Runtime y lenguaje principal
- **Express** — Framework HTTP
- **Worker Threads** — Concurrencia real en Node.js
- **Swagger** — Documentación de API REST
- **DDD** — Domain-Driven Design (entidades, value objects, servicios)

### Frontend
- **Vue 3** — Framework reactivo con Composition API
- **Vite** — Build tool ultrarrápido
- **Pinia** — State management
- **Axios** — Cliente HTTP (operaciones CRUD)
- **Fetch API** — Cliente HTTP nativo (endpoint de cancelación)
- **TypeScript** — Tipado estricto

### Testing
- **Vitest** — Test runner
- **Supertest** — Tests de integración HTTP

---

## 📁 Estructura del Proyecto


```
p-ec2-evaluacion/
├── src/
│   ├── server.ts                          # Punto de entrada del servidor Express
│   │
│   ├── domain/                            # Capa de Dominio (DDD)
│   │   ├── Descarga.ts                    # Entidad principal + Value Objects + Errores
│   │   └── Modelos.ts                     # Modelos del dominio
│   │
│   ├── application/                       # Capa de Aplicación (DDD)
│   │   └── DescargaService.ts             # Servicio de aplicación - lógica de negocio
│   │
│   ├── infrastructure/                    # Capa de Infraestructura (DDD)
│   │   └── workers/
│   │       ├── Descargadores.ts           # Implementaciones HTTP, FTP, Mock
│   │       └── descargaWorker.ts          # Worker Thread de Node.js
│   │
│   ├── interfaces/                        # Capa de Interfaces (DDD)
│   │   ├── controllers/
│   │   │   └── descargas.controller.ts    # Controllers Express
│   │   ├── middleware/
│   │   │   ├── corsMiddleware.ts          # Middleware CORS
│   │   │   ├── errorMiddleware.ts         # Manejo global de errores
│   │   │   └── validationMiddleware.ts    # Validación de requests
│   │   └── routes/
│   │       └── descargas.routes.ts        # Definición de rutas API
│   │
│   ├── shared/                            # Utilidades compartidas
│   │   ├── config.ts                      # Configuración de la app
│   │   ├── instances.ts                   # Instancias compartidas
│   │   ├── enums/
│   │   │   └── index.ts                   # Enums del dominio
│   │   ├── types/
│   │   │   └── index.ts                   # Tipos e interfaces TypeScript
│   │   └── utils/
│   │       ├── logger.ts                  # Logger centralizado
│   │       ├── urlValidator.ts            # Validador de URLs
│   │       ├── uuidGenerator.ts           # Generador de UUIDs
│   │       └── workerPool.ts              # Pool de Worker Threads
│   │
│   ├── frontend/                          # Frontend Vue 3
│   │   ├── App.vue                        # Componente raíz
│   │   ├── main.ts                        # Punto de entrada Vue
│   │   ├── index.html                     # HTML base
│   │   │
│   │   ├── components/                    # Componentes reutilizables
│   │   │   ├── DownloadForm.vue           # Formulario nueva descarga
│   │   │   ├── DownloadList.vue           # Tabla de descargas (con botón cancelar)
│   │   │   ├── DownloadStatus.vue         # Badge de estado (incluye cancelado)
│   │   │   ├── DownloadCard.vue           # Modal detalle de descarga
│   │   │   ├── ProgressBar.vue            # Barra de progreso
│   │   │   └── ErrorBoundary.vue          # Captura errores del árbol
│   │   │
│   │   ├── pages/                         # Páginas principales
│   │   │   └── DashboardPage.vue          # Dashboard principal
│   │   │
│   │   ├── services/                      # Servicios HTTP
│   │   │   ├── apiClient.ts               # Cliente Axios configurado
│   │   │   └── downloadService.ts         # Llamadas a la API REST
│   │   │
│   │   ├── composables/                   # Lógica reactiva reutilizable
│   │   │   ├── useDownloads.ts            # Estado descargas + polling
│   │   │   └── useDownloadForm.ts         # Estado y validación del formulario
│   │   │
│   │   ├── types/                         # Tipos TypeScript
│   │   │   └── index.ts                   # Interfaces y tipos del frontend
│   │   │
│   │   ├── stores/                        # Pinia stores
│   │   │   └── downloadStore.ts           # Store global de descargas
│   │   │
│   │   ├── utils/                         # Utilidades del frontend
│   │   │   └── validators.ts              # Validadores de formulario
│   │   │
│   │   └── __tests__/                     # Tests del frontend
│   │       ├── integration/
│   │       │   └── downloadAPI.test.ts    # Tests de integración API (6 tests)
│   │       └── e2e/
│   │           └── downloadFlow.spec.ts   # Tests E2E flujos completos (5 tests)
│   │
│   └── __tests__/                         # Tests del backend
│       └── unit/
│           └── UrlDescarga.test.ts        # Tests unitarios dominio (15 tests)
│
├── vite.config.ts                         # Configuración Vite
├── vitest.config.ts                       # Configuración Vitest
├── tsconfig.json                          # Configuración TypeScript
├── package.json                           # Dependencias y scripts
└── README.md                              # Documentación del proyecto
```

---

## ⚙️ Instalación y Ejecucion

### Requisitos
- Node.js 18+
- npm

### 1. Clonar el repositorio
```bash
git clone https://github.com/FabricioRivero/p-ec2-evaluacion
cd p-ec2-evaluacion
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env
```

### 4. Ejecutar Backend (Terminal 1)
```bash
npm run dev
```
Backend disponible en: `http://localhost:3000`  
Swagger disponible en: `http://localhost:3000/api-docs`

### 5. Ejecutar Frontend (Terminal 2)
```bash
npx vite
```
Frontend disponible en: `http://localhost:5173`

---

## 🧪 Ejecutar Tests

### Todos los tests
```bash
npx vitest run
```

### Solo tests unitarios
```bash
npx vitest run src/__tests__/unit/UrlDescarga.test.ts
```

### Solo tests de integración
```bash
npx vitest run src/frontend/__tests__/integration/downloadAPI.test.ts
```

### Solo tests E2E
```bash
npx vitest run src/frontend/__tests__/integration/e2e/downloadFlow.spec.ts
```
---

## 📊 Resultados de Tests

✓ src/__tests__/unit/UrlDescarga.test.ts          (15 tests)

✓ src/frontend/__tests__/integration/downloadAPI.test.ts   (6 tests)

✓ src/frontend/__tests__/integration/e2e/downloadFlow.spec.ts  (5 tests)
Test Files: 3 passed

Tests:      26 passed

---

## 🌐 API REST

| Método | Endpoint                        | Descripción                   |
| ------ | ------------------------------- | ----------------------------- |
| POST   | `/api/descargas`                | Crear nueva descarga          |
| GET    | `/api/descargas`                | Listar todas las descargas    |
| GET    | `/api/descargas/:id/estado`     | Obtener estado de descarga    |
| POST   | `/api/descargas/:id/reintentar` | Reintentar descarga fallida   |
| DELETE | `/api/descargas/:id/cancelar`   | Cancelar descarga en progreso |
| GET    | `/health`                       | Health check                  |
| GET    | `/api-docs`                     | Documentación Swagger         |

### Ejemplo de request
```bash
curl -X POST http://localhost:3000/api/descargas \
  -H "Content-Type: application/json" \
  -d '{"url": "http://ejemplo.com/file.pdf", "tipo": "mock", "maxReintentos": 3}'
```

### Ejemplo de response
```json
{
  "id": "uuid-generado",
  "url": "http://ejemplo.com/file.pdf",
  "tipo": "mock",
  "estado": "pending",
  "progreso": 0,
  "intentos": 0,
  "maxReintentos": 3,
  "fechaCreacion": "2026-06-19T00:00:00.000Z"
}
```

---

## 🎯 Funcionalidades del Frontend

✅ Formulario para crear descargas con validación en tiempo real
✅ Tabla con todas las descargas (ID, URL, Tipo, Estado, Progreso, Intentos, Fecha)
✅ Colores por estado (gris=pendiente, azul=en progreso, verde=completado, rojo=error, naranja=cancelado)
✅ Barra de progreso animada
✅ Botón reintentar para descargas en error
✅ Botón cancelar para descargas pendientes/en progreso
✅ Estado cancelado con color distintivo (naranja)
✅ Estadísticas en tiempo real (Total, En Progreso, Completadas, Errores, Canceladas)
✅ Polling automático cada 2 segundos
✅ Diseño responsive (mobile-first)

---

## 🏗️ Arquitectura DDD

- Entidad: Descarga — objeto principal con identidad y ciclo de vida
- Value Object: UrlDescarga — valida y encapsula la URL
- Errores de dominio: DescargaError, UrlInvalidaError
- Application Service: DescargaService — orquesta la lógica
- Infrastructure: WorkerPool, Descargadores — implementación técnica
- Interface: Controllers, Routes, Middleware — capa HTTP


📄 Documentación Adicional
Informe Técnico: Ver Informe_EC3_FabricioRivero.pdf en el repositorio
Video de Presentación: Disponible en [https://drive.google.com/file/d/1WyOTgqXfpVj6mF8aSG6Umr7Yi7EOMDiO/view?usp=sharing]
Repositorio: github.com/FabricioRivero/p-ec2-evaluacion



---

