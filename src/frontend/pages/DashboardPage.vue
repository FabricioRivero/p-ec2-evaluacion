<template>
  <div class="dashboard">
    <header class="header">
      <div>
        <h1>Simulador de Descargas Concurrentes</h1>
        <p class="subtitle">SIS-113 Programación Orientada a Objetos</p>
      </div>
      <div class="polling-badge">Live — actualiza cada 2s</div>
    </header>

    <!-- Stats -->
    <div class="stats-grid">
      <div class="stat-card">
        <span class="stat-num">{{ descargas.length }}</span>
        <span class="stat-lbl">Total</span>
      </div>
      <div class="stat-card blue">
        <span class="stat-num">{{ enProgreso }}</span>
        <span class="stat-lbl">En Progreso</span>
      </div>
      <div class="stat-card green">
        <span class="stat-num">{{ completadas }}</span>
        <span class="stat-lbl">Completadas</span>
      </div>
      <div class="stat-card red">
        <span class="stat-num">{{ errores }}</span>
        <span class="stat-lbl">Errores</span>
      </div>
    </div>

    <!-- Form -->
    <DownloadForm :on-submit="crearDescarga" />

    <!-- Notifications -->
    <transition name="fade">
      <div v-if="successMsg" class="notif success">✅ {{ successMsg }}</div>
    </transition>
    <transition name="fade">
      <div v-if="error" class="notif error">❌ {{ error }}</div>
    </transition>

    <!-- List -->
    <DownloadList :downloads="descargas" @reintentar="reintentar" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import DownloadForm from '../components/DownloadForm.vue'
import DownloadList from '../components/DownloadList.vue'
import { useDownloads } from '../composables/useDownloads'
import { downloadService } from '../services/downloadService'
import type { CrearDescargaDTO } from '../types'

const { descargas, error, fetchDescargas, reintentar } = useDownloads()
const successMsg = ref<string | null>(null)

const enProgreso  = computed(() => descargas.value.filter(d => d.estado === 'in_progress').length)
const completadas = computed(() => descargas.value.filter(d => d.estado === 'completed').length)
const errores     = computed(() => descargas.value.filter(d => d.estado === 'error').length)

async function crearDescarga(data: CrearDescargaDTO) {
  await downloadService.crear(data)
  successMsg.value = `Descarga iniciada: ${data.url}`
  setTimeout(() => { successMsg.value = null }, 3000)
  await fetchDescargas()
}
</script>

<style scoped>
.dashboard { max-width: 1100px; margin: 0 auto; padding: 28px 20px; font-family: system-ui, -apple-system, sans-serif; display: flex; flex-direction: column; gap: 24px; }
.header { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px; }
h1 { margin: 0; color: #1a202c; font-size: 1.6rem; }
.subtitle { margin: 4px 0 0; color: #718096; font-size: 0.9rem; }
.polling-badge { background: #fed7d7; color: #c53030; border-radius: 20px; padding: 6px 14px; font-size: 0.8rem; font-weight: 700; align-self: center; }
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.stat-card { background: white; border-radius: 12px; padding: 20px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.06); display: flex; flex-direction: column; gap: 4px; }
.stat-card.blue  { border-top: 4px solid #4299e1; }
.stat-card.green { border-top: 4px solid #48bb78; }
.stat-card.red   { border-top: 4px solid #fc8181; }
.stat-num { font-size: 2.2rem; font-weight: 800; color: #2d3748; }
.stat-lbl { font-size: 0.85rem; color: #718096; font-weight: 600; }
.notif { border-radius: 8px; padding: 12px 18px; font-weight: 600; }
.notif.success { background: #c6f6d5; color: #276749; }
.notif.error   { background: #fed7d7; color: #c53030; }
.fade-enter-active, .fade-leave-active { transition: opacity .4s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
@media (max-width: 640px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } h1 { font-size: 1.2rem; } }
</style>