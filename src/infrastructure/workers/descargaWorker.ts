import { parentPort } from 'worker_threads';
import { MensajeWorker, RespuestaWorker } from '../../shared/types';
import { logger } from '../../shared/utils/logger';

if (!parentPort) {
  throw new Error('This script must be executed as a Worker');
}

// El trabajador se queda "vivo" esperando que le lleguen mensajes (tareas)
parentPort.on('message', async (mensaje: MensajeWorker) => {
  try {
    logger.info(`[Worker] Iniciando descarga simulada (Mock): ${mensaje.id} de tipo ${mensaje.tipo}`);

    // Simulamos el tiempo que tarda una descarga real (3 segundos)
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Preparamos la respuesta exitosa con los tipos exactos del profesor
    const respuesta: RespuestaWorker = {
      id: mensaje.id,
      success: true,
      data: Buffer.from(`Archivo simulado de ${mensaje.url} descargado con éxito`),
      intentos: 1
    };

    // Le devolvemos el resultado al hilo principal
    parentPort!.postMessage(respuesta);
    
    logger.info(`[Worker] Descarga ${mensaje.id} completada. Listo para la siguiente tarea.`);
  } catch (error) {
    const respuesta: RespuestaWorker = {
      id: mensaje.id,
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      codigo: (error as { codigo?: string })?.codigo || 'UNKNOWN_ERROR',
      intentos: 0
    };

    parentPort!.postMessage(respuesta);
  }
});

logger.info('Worker ready and waiting for messages');