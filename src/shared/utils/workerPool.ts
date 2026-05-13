import path from 'path';
import { Worker } from 'worker_threads';
import { MensajeWorker, RespuestaWorker } from '../types';
import { config } from '../config';
import { logger } from './logger';

/**
 * Worker pool for concurrent downloads
 */
interface Tarea {
  mensaje: MensajeWorker;
  resolver: (respuesta: RespuestaWorker) => void;
  rechazar: (error: Error) => void;
}

export class WorkerPool {
  private workers: Worker[] = [];
  private cola: Tarea[] = [];
  private tareasEnProgreso: Map<number, boolean> = new Map();

  constructor() {
    this.inicializarWorkers();
  }

  private inicializarWorkers(): void {
    const workerPath = path.join(config.WORKERS_PATH, 'descargaWorker.ts');

    for (let i = 0; i < config.MAX_CONCURRENT_WORKERS; i++) {
      const worker = new Worker(workerPath);

      worker.on('message', (respuesta: RespuestaWorker) => {
        logger.debug(`Worker ${i} completed task ${respuesta.id}`);
        // TODO: Handle the response and release worker
      });

      worker.on('error', (error) => {
        logger.error(`Worker ${i} error`, error);
      });

      this.workers.push(worker);
      this.tareasEnProgreso.set(i, false);
    }

    logger.info(`Worker pool of ${config.MAX_CONCURRENT_WORKERS} initialized`);
  }

  async enqueue(mensaje: MensajeWorker): Promise<RespuestaWorker> {
    return new Promise((resolver, rechazar) => {
      const tarea: Tarea = { mensaje, resolver, rechazar };
      this.cola.push(tarea);
      this.procesarCola();
    });
  }

  private procesarCola(): void {
    if (this.cola.length === 0) return;

    // TODO: Implement task distribution to free workers
    // - Find a worker that is not busy
    // - Send the task
    // - Mark it as busy
    // - On response, mark as free and process next
  }

  destruir(): void {
    this.workers.forEach((worker) => worker.terminate());
    logger.info('WorkerPool destroyed');
  }
}
