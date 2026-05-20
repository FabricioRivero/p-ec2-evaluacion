import { parentPort } from 'worker_threads';
import { MensajeWorker, RespuestaWorker } from '../../shared/types';
import { logger } from '../../shared/utils/logger';
import { DescargadorFactory } from './Descargadores';
import { UrlDescarga } from '../../domain/Modelos';

if (!parentPort) {
  throw new Error('This script must be executed as a Worker');
}

parentPort.on('message', async (mensaje: MensajeWorker) => {
  try {
    // 1. Usamos nuestro Value Object para validar la URL
    const urlValidada = new UrlDescarga(mensaje.url);

    // 2. Usamos el Patrón Fábrica para obtener el descargador correcto
    const descargador = DescargadorFactory.crear(mensaje.tipo);

    logger.info(`[Worker] Iniciando con patrón Factory: ${mensaje.id}`);

    // 3. Polimorfismo en acción: Ejecutamos el método del padre
    const datosBuffer = await descargador.descargar(urlValidada.valor);

    // 4. Respondemos con éxito
    const respuesta: RespuestaWorker = {
      id: mensaje.id,
      success: true,
      data: datosBuffer,
      intentos: 1
    };

    parentPort!.postMessage(respuesta);
    
} catch (error) {
    // Manejo del error con la jerarquía que creamos
    const respuesta: RespuestaWorker = {
      id: mensaje.id,
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      // Verificamos si es un Error antes de sacar su nombre
      codigo: error instanceof Error ? error.constructor.name : 'UNKNOWN_ERROR',
      intentos: 0
    };

    parentPort!.postMessage(respuesta);
  }
});