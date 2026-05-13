# Concurrent Download Simulator

Simulator for concurrent downloads implemented with Node.js, TypeScript, and Worker Threads.

## Quick Start

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

Open http://localhost:3000/api-docs for Swagger documentation.

### Build

```bash
npm run build
npm start
```

## API Endpoints

### Create Download

```bash
POST /api/descargas
Content-Type: application/json

{
  "url": "https://example.com/file.pdf",
  "tipo": "http",
  "maxReintentos": 3
}
```

### Get Status

```bash
GET /api/descargas/{id}/estado
```

### List Downloads

```bash
GET /api/descargas
```

### Retry Download

```bash
POST /api/descargas/{id}/reintentar
```

## Architecture

- domain/: entities, value objects, interfaces, errors
- application/: use cases and handlers
- infrastructure/: concrete implementations, workers, repositories
- interfaces/: controllers, routes, middleware

## Provided Scaffolding

- Express routes with Swagger
- Input validation middleware
- Global error handling middleware
- DDD-ready folder structure

### To be implemented by student

- Entities and value objects
- Abstract class DescargadorBase
- Concrete downloaders (HTTP, FTP, Mock)
- Downloader factory
- Error hierarchy
- Worker pool and concurrency
