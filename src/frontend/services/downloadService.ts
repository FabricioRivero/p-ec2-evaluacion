import apiClient from './apiClient'
import type { Descarga, CrearDescargaDTO } from '../types'

export const downloadService = {
  async crear(data: CrearDescargaDTO): Promise<Descarga> {
    const res = await apiClient.post<Descarga>('/descargas', data)
    return res.data
  },

  async listar(): Promise<Descarga[]> {
    const res = await apiClient.get<Descarga[]>('/descargas')
    return res.data
  },

  async obtenerEstado(id: string): Promise<Descarga> {
    const res = await apiClient.get<Descarga>(`/descargas/${id}/estado`)
    return res.data
  },

  async reintentar(id: string): Promise<Descarga> {
    const res = await apiClient.post<Descarga>(`/descargas/${id}/reintentar`)
    return res.data
  }
}