<template>
  <div class="form-card">
    <h2> Nueva Descarga</h2>

    <div class="field">
      <label>URL</label>
      <input
        v-model="url"
        type="text"
        placeholder="http://ejemplo.com/archivo.pdf"
        :class="{ invalid: url && !urlValida }"
      />
      <span v-if="url && !urlValida" class="hint error">
        Debe empezar con http, ftp o mock
      </span>
    </div>

    <div class="field">
      <label>Tipo</label>
      <select v-model="tipo">
        <option value="http">HTTP</option>
        <option value="ftp">FTP</option>
        <option value="mock">Mock</option>
      </select>
    </div>

    <div class="field">
      <label>Reintentos máximos (0–5)</label>
      <input v-model.number="maxReintentos" type="number" min="0" max="5" />
    </div>

    <p v-if="formError" class="hint error">{{ formError }}</p>

    <button @click="submit" :disabled="!formValido || submitting">
      {{ submitting ? ' Iniciando...' : ' Iniciar Descarga' }}
    </button>
  </div>
</template>

<!-- 
 * DownloadForm.vue
 * Formulario para crear nuevas descargas.
 * @prop onSubmit - Función callback que recibe los datos del formulario
-->
 
<script setup lang="ts">
import { useDownloadForm } from '../composables/useDownloadForm'
import type { CrearDescargaDTO } from '../types'

const props = defineProps<{ onSubmit: (data: CrearDescargaDTO) => Promise<void> }>()
const { url, tipo, maxReintentos, submitting, formError, urlValida, formValido, submit } =
  useDownloadForm(props.onSubmit)
</script>

<style scoped>
.form-card { background: white; border-radius: 12px; padding: 24px; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
h2 { margin: 0 0 20px; color: #2d3748; }
.field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
label { font-weight: 600; font-size: 0.9rem; color: #4a5568; }
input, select { border: 1.5px solid #cbd5e0; border-radius: 8px; padding: 9px 12px; font-size: 1rem; transition: border-color .2s; }
input:focus, select:focus { outline: none; border-color: #4299e1; }
input.invalid { border-color: #fc8181; }
.hint { font-size: 0.8rem; }
.error { color: #c53030; }
button { width: 100%; background: #4299e1; color: white; border: none; border-radius: 8px; padding: 12px; font-size: 1rem; font-weight: 700; cursor: pointer; transition: background .2s; }
button:hover:not(:disabled) { background: #3182ce; }
button:disabled { opacity: 0.5; cursor: not-allowed; }
</style>