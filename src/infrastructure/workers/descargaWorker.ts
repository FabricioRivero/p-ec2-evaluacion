import { parentPort } from 'worker_threads';
import { MensajeWorker, RespuestaWorker } from '../../shared/types';
import { logger } from '../../shared/utils/logger';

/**
 * Worker that executes downloads in isolation
 */
if (!parentPort) {
  throw new Error('This script must be executed as a Worker');
}

parentPort.on('message', async (mensaje: MensajeWorker) => {
  try {
    logger.debug(`Worker starting download: ${mensaje.id}`);

    const { id, url, tipo, maxReintentos } = mensaje;

    // TODO: Student implementation
    // 1. Instantiate downloader by type
    // 2. Call ejecutarConReintento()
    // 3. Send result to main thread

    const respuesta: RespuestaWorker = {
      id,
      success: true,
      data: Buffer.from('mock data'),
      intentos: 1
    };

    parentPort!.postMessage(respuesta);
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
