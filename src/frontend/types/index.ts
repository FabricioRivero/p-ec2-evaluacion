export type EstadoDescarga = 'pending' | 'in_progress' | 'completed' | 'error'
export type TipoDescarga = 'http' | 'ftp' | 'mock'

export interface Descarga {
  id: string
  url: string
  tipo: TipoDescarga
  estado: EstadoDescarga
  progreso: number
  intentos: number
  maxReintentos: number
  fechaCreacion: string
  error?: string
}

export interface CrearDescargaDTO {
  url: string
  tipo: TipoDescarga
  maxReintentos: number
}