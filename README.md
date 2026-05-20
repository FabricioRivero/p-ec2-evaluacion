# Simulador de Descargas Concurrentes

Este es mi proyecto para simular descargas concurrentes. Está construido usando Node.js, TypeScript y Worker Threads, aplicando los principios de Diseño Orientado al Dominio (DDD) y patrones de diseño.

## Cómo hacer correr el proyecto

### 1. Instalar dependencias
```bash
npm install
2. Levantar en Modo Desarrollo
Bash
npm run dev
Una vez que el servidor esté corriendo, puedes abrir la documentación y probar la API en Swagger: http://localhost:3000/api-docs

3. Compilar para Producción
Bash
npx tsc
npm start
🌐 Endpoints de la API
Crear una descarga
POST /api/descargas

JSON
{
  "url": "[https://ejemplo.com/archivo-pesado.pdf](https://ejemplo.com/archivo-pesado.pdf)",
  "tipo": "http",
  "maxReintentos": 3
}
Ver el estado de una descarga específica
GET /api/descargas/{id}/estado

Listar todas las descargas en memoria
GET /api/descargas

Reintentar una descarga (En construcción)
POST /api/descargas/{id}/reintentar

🏗️ Arquitectura del Proyecto (DDD)
El código está estructurado en capas para separar la lógica de negocio de la infraestructura:

domain/: Entidades principales (Descarga), Value Objects (UrlDescarga) y la jerarquía de errores.

application/: Casos de uso y el servicio "gerente" (DescargaService).

infrastructure/: Implementaciones concretas, los Worker Threads, el Worker Pool y las clases de descarga.

interfaces/: Controladores, rutas de Express y middlewares (proporcionados en la estructura base).

Lo que implementé para esta evaluación
A partir del andamiaje inicial, desarrollé y completé los siguientes requerimientos:

Worker Pool y Concurrencia: Implementé una piscina de hilos (workers) que encola y procesa descargas en paralelo sin bloquear el hilo principal de Node.js.

Entidades y Value Objects: Creación de la entidad central y validación de URLs usando objetos de valor.

Clase Abstracta DescargadorBase: Para aplicar herencia en los métodos de descarga.

Descargadores Concretos: Implementación de simuladores independientes para HTTP, FTP y Mock.

Patrón Factory: Creación de DescargadorFactory para decidir dinámicamente qué clase instanciar según la petición (Polimorfismo).

Jerarquía de Errores: Errores personalizados (UrlInvalidaError, etc.) para un mejor manejo de excepciones.


