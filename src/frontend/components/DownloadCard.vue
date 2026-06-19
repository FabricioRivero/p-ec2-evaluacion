<!--
 * DownloadCard.vue
 * Muestra los detalles completos de una descarga individual en modal.
 * @prop download - Objeto Descarga con todos sus campos
 * @emit cerrar - Evento emitido al presionar el botón cerrar
-->
<template>
  <div class="card-overlay" @click.self="$emit('cerrar')">
    <div class="card">
      <div class="card-header">
        <h2>Detalle de Descarga</h2>
        <button class="btn-close" @click="$emit('cerrar')">✕</button>
      </div>

      <div class="card-body">
        <div class="field">
          <span class="label">ID</span>
          <span class="value mono">{{ download.id }}</span>
        </div>
        <div class="field">
          <span class="label">URL</span>
          <span class="value url">{{ download.url }}</span>
        </div>
        <div class="field">
          <span class="label">Tipo</span>
          <span class="value">{{ download.tipo.toUpperCase() }}</span>
        </div>
        <div class="field">
          <span class="label">Estado</span>
          <DownloadStatus :status="download.estado" />
        </div>
        <div class="field">
          <span class="label">Progreso</span>
          <div style="flex: 1">
            <ProgressBar :progress="download.progreso" />
          </div>
        </div>
        <div class="field">
          <span class="label">Intentos</span>
          <span class="value">{{ download.intentos }} de {{ download.maxReintentos }}</span>
        </div>
        <div class="field">
          <span class="label">Fecha creación</span>
          <span class="value">{{ formatDate(download.fechaCreacion) }}</span>
        </div>
        <div v-if="download.error" class="field error-field">
          <span class="label">Error</span>
          <span class="value error-msg">{{ download.error }}</span>
        </div>
      </div>

      <div class="card-footer">
        <button class="btn-secondary" @click="$emit('cerrar')">
          ← Volver a la lista
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Componente DownloadCard
 * Muestra el detalle completo de una descarga en un modal overlay.
 */
import type { Descarga } from '../types'
import DownloadStatus from './DownloadStatus.vue'
import ProgressBar from './ProgressBar.vue'

defineProps<{ download: Descarga }>()
defineEmits<{ (e: 'cerrar'): void }>()

const formatDate = (iso: string) => new Date(iso).toLocaleString('es-BO')
</script>

<style scoped>
.card-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
.card { background: white; border-radius: 14px; width: 100%; max-width: 560px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); overflow: hidden; }
.card-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; background: #f7fafc; border-bottom: 1px solid #e2e8f0; }
.card-header h2 { margin: 0; font-size: 1.1rem; color: #1a202c; }
.btn-close { background: none; border: none; font-size: 1.2rem; cursor: pointer; color: #718096; padding: 4px 8px; border-radius: 4px; }
.btn-close:hover { background: #e2e8f0; }
.card-body { padding: 20px 24px; display: flex; flex-direction: column; gap: 14px; }
.field { display: flex; align-items: center; gap: 12px; }
.label { font-size: 0.85rem; font-weight: 600; color: #718096; min-width: 100px; }
.value { font-size: 0.95rem; color: #2d3748; flex: 1; }
.mono { font-family: monospace; font-size: 0.8rem; word-break: break-all; }
.url { word-break: break-all; color: #4299e1; }
.error-field { background: #fff5f5; border-radius: 8px; padding: 10px; }
.error-msg { color: #c53030; font-size: 0.9rem; }
.card-footer { padding: 16px 24px; border-top: 1px solid #e2e8f0; background: #f7fafc; }
.btn-secondary { background: white; border: 1.5px solid #cbd5e0; border-radius: 8px; padding: 8px 16px; cursor: pointer; font-size: 0.9rem; color: #4a5568; font-weight: 600; }
.btn-secondary:hover { background: #f7fafc; }
@media (max-width: 640px) { .card { margin: 10px; } }
</style>