<!--
 * ErrorBoundary.vue
 * Captura errores en el árbol de componentes hijos usando onErrorCaptured.
 * Muestra un mensaje amigable y permite reintentar.
 * @slot default - Componentes hijos a proteger
-->
<template>
  <div>
    <div v-if="hayError" class="error-boundary">
      <div class="error-icon">⚠️</div>
      <h3>Algo salió mal</h3>
      <p class="error-detail">{{ mensajeError }}</p>
      <button @click="reintentar" class="btn-retry">
        🔄 Reintentar
      </button>
    </div>
    <slot v-else />
  </div>
</template>

<script setup lang="ts">
/**
 * Componente ErrorBoundary
 * Implementa el patrón Error Boundary de Vue 3 usando onErrorCaptured.
 * Captura errores de cualquier componente hijo y muestra UI de fallback.
 */
import { ref, onErrorCaptured } from 'vue'

const hayError = ref(false)
const mensajeError = ref('Error desconocido')

onErrorCaptured((error: Error) => {
  hayError.value = true
  mensajeError.value = error.message || 'Ocurrió un error inesperado'
  return false // evita que el error se propague
})

function reintentar() {
  hayError.value = false
  mensajeError.value = ''
}
</script>

<style scoped>
.error-boundary {
  background: #fff5f5;
  border: 1.5px solid #fc8181;
  border-radius: 12px;
  padding: 32px;
  text-align: center;
  margin: 16px 0;
}
.error-icon { font-size: 2.5rem; margin-bottom: 12px; }
h3 { margin: 0 0 8px; color: #c53030; font-size: 1.1rem; }
.error-detail { color: #718096; font-size: 0.9rem; margin-bottom: 20px; }
.btn-retry {
  background: #fc8181;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
}
.btn-retry:hover { background: #f56565; }
</style>