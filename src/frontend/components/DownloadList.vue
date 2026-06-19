<!--
 * DownloadList.vue
 * Tabla de descargas con colores por estado y acciones disponibles.
 * @prop downloads - Array de descargas a mostrar
 * @emit reintentar - Emite el ID de la descarga a reintentar
 * @emit verDetalle - Emite el objeto Descarga seleccionado
-->
<template>
  <div class="list-card">
    <h2>📋 Descargas ({{ downloads.length }})</h2>

    <div v-if="downloads.length === 0" class="empty">
      No hay descargas todavía. ¡Crea una arriba!
    </div>

    <div v-else class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>URL</th>
            <th>Tipo</th>
            <th>Estado</th>
            <th>Progreso</th>
            <th>Intentos</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="d in downloads" :key="d.id" :class="`row--${d.estado}`">
            <td class="mono">{{ d.id.slice(0, 8) }}…</td>
            <td class="url-cell" :title="d.url">{{ truncate(d.url) }}</td>
            <td>{{ d.tipo }}</td>
            <td><DownloadStatus :status="d.estado" /></td>
            <td><ProgressBar :progress="d.progreso" /></td>
            <td>{{ d.intentos }} / {{ d.maxReintentos }}</td>
            <td>{{ formatDate(d.fechaCreacion) }}</td>
            <td class="actions-cell">
              <button @click="$emit('verDetalle', d)" class="btn-detail">
                 Detalle
              </button>
              <button
                v-if="d.estado === 'error'"
                @click="$emit('reintentar', d.id)"
                class="btn-retry"
              >
                 Reintentar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Descarga } from '../types'
import DownloadStatus from './DownloadStatus.vue'
import ProgressBar from './ProgressBar.vue'

defineProps<{ downloads: Descarga[] }>()
defineEmits<{
  (e: 'reintentar', id: string): void
  (e: 'verDetalle', descarga: Descarga): void
}>()

const truncate = (url: string) => url.length > 45 ? url.slice(0, 45) + '…' : url
const formatDate = (iso: string) => new Date(iso).toLocaleString('es-BO')
</script>

<style scoped>
.list-card { background: white; border-radius: 12px; padding: 24px; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
h2 { margin: 0 0 16px; color: #2d3748; }
.table-wrap { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; font-size: 0.88rem; }
th { background: #f7fafc; text-align: left; padding: 10px 8px; border-bottom: 2px solid #e2e8f0; font-weight: 700; color: #4a5568; white-space: nowrap; }
td { padding: 10px 8px; border-bottom: 1px solid #f0f4f8; vertical-align: middle; }
.mono { font-family: monospace; font-size: 0.8rem; color: #718096; }
.url-cell { max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.row--error td       { background: #fff5f5; }
.row--completed td   { background: #f0fff4; }
.row--in_progress td { background: #ebf8ff; }
.actions-cell { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
.btn-detail { background: #667eea; color: white; border: none; border-radius: 6px; padding: 5px 10px; cursor: pointer; font-size: 0.8rem; font-weight: 600; white-space: nowrap; }
.btn-detail:hover { background: #5a67d8; }
.btn-retry { background: #ed8936; color: white; border: none; border-radius: 6px; padding: 5px 10px; cursor: pointer; font-size: 0.8rem; font-weight: 600; white-space: nowrap; }
.btn-retry:hover { background: #dd6b20; }
.empty { color: #a0aec0; text-align: center; padding: 40px; font-size: 1rem; }
</style>