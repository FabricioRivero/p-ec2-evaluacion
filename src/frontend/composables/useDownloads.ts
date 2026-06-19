import { ref, onMounted, onUnmounted } from 'vue'
import { downloadService } from '../services/downloadService'
import type { Descarga } from '../types'

export function useDownloads() {
  const descargas = ref<Descarga[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  let intervalId: ReturnType<typeof setInterval> | null = null

  async function fetchDescargas() {
    try {
      descargas.value = await downloadService.listar()
      error.value = null
    } catch (e: any) {
      error.value = e.message
    }
  }

  async function reintentar(id: string) {
    try {
      await downloadService.reintentar(id)
      await fetchDescargas()
    } catch (e: any) {
      error.value = e.message
    }
  }

  onMounted(async () => {
    loading.value = true
    await fetchDescargas()
    loading.value = false
    intervalId = setInterval(fetchDescargas, 2000)
  })

  onUnmounted(() => {
    if (intervalId) clearInterval(intervalId)
  })

  return { descargas, loading, error, fetchDescargas, reintentar }
}