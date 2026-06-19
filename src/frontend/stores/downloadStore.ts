/**
 * Store de Pinia para el estado global de descargas.
 * Actualmente el estado se maneja con composables (useDownloads),
 * pero este store está disponible para escalar la aplicación.
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Descarga } from '../types'

export const useDownloadStore = defineStore('downloads', () => {
  const ultimaDescargaCreada = ref<Descarga | null>(null)
  const totalCreadas = ref(0)

  function registrarNuevaDescarga(descarga: Descarga) {
    ultimaDescargaCreada.value = descarga
    totalCreadas.value++
  }

  function resetear() {
    ultimaDescargaCreada.value = null
    totalCreadas.value = 0
  }

  return { ultimaDescargaCreada, totalCreadas, registrarNuevaDescarga, resetear }
})