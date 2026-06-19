<template>
  <span :class="['badge', `badge--${status}`]">{{ label }}</span>
</template>

<!--
 * DownloadStatus.vue
 * Badge visual que indica el estado de una descarga con color semántico.
 * @prop status - Estado: pending | in_progress | completed | error
-->

<script setup lang="ts">
import { computed } from 'vue'
import type { EstadoDescarga } from '../types'

const props = defineProps<{ status: EstadoDescarga }>()

const label = computed(() => ({
  pending: '⏳ Pendiente',
  in_progress: ' En Progreso',
  completed: ' Completado',
  error: ' Error'
}[props.status] ?? props.status))
</script>

<style scoped>
.badge { padding: 4px 12px; border-radius: 12px; font-size: 0.8rem; font-weight: 600; white-space: nowrap; }
.badge--pending    { background: #e2e8f0; color: #4a5568; }
.badge--in_progress{ background: #bee3f8; color: #2b6cb0; }
.badge--completed  { background: #c6f6d5; color: #276749; }
.badge--error      { background: #fed7d7; color: #c53030; }
</style>