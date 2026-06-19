import { ref, computed } from 'vue'
import type { CrearDescargaDTO, TipoDescarga } from '../types'

export function useDownloadForm(onSubmit: (data: CrearDescargaDTO) => Promise<void>) {
  const url = ref('')
  const tipo = ref<TipoDescarga>('mock')
  const maxReintentos = ref(3)
  const submitting = ref(false)
  const formError = ref<string | null>(null)

  const urlValida = computed(() => {
    if (!url.value) return false
    return url.value.startsWith('http') || url.value.startsWith('ftp') || url.value.startsWith('mock')
  })

  const formValido = computed(() =>
    urlValida.value && maxReintentos.value >= 0 && maxReintentos.value <= 5
  )

  async function submit() {
    if (!formValido.value) return
    submitting.value = true
    formError.value = null
    try {
      await onSubmit({ url: url.value, tipo: tipo.value, maxReintentos: maxReintentos.value })
      url.value = ''
      maxReintentos.value = 3
    } catch (e: any) {
      formError.value = e.message
    } finally {
      submitting.value = false
    }
  }

  return { url, tipo, maxReintentos, submitting, formError, urlValida, formValido, submit }
}