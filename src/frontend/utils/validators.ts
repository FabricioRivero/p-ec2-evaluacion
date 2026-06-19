/**
 * Valida si una cadena es una URL válida para el simulador.
 * Acepta protocolos: http, https, ftp, mock
 */
export function esUrlValida(url: string): boolean {
  if (!url) return false
  return url.startsWith('http') || url.startsWith('ftp') || url.startsWith('mock')
}

/**
 * Valida que los reintentos estén en el rango permitido (0-5)
 */
export function esReintentosValido(n: number): boolean {
  return Number.isInteger(n) && n >= 0 && n <= 5
}