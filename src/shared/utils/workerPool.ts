import path from 'path';
import { Worker } from 'worker_threads';
import { MensajeWorker, RespuestaWorker } from '../types';
import { config } from '../config';
import { logger } from './logger';

interface Tarea {
  mensaje: MensajeWorker;
  resolver: (respuesta: RespuestaWorker) => void;
  rechazar: (error: Error) => void;
}

export class WorkerPool {
  private workers: Worker[] = [];
  private cola: Tarea[] = [];
  private tareasEnProgreso: Map<number, boolean> = new Map();
  // Mapa extra para recordar quién pidió qué tarea
  private tareasActivas: Map<string, Tarea> = new Map(); 

  constructor() {
    this.inicializarWorkers();
  }

  private inicializarWorkers(): void {
    const workerPath = path.join(config.WORKERS_PATH, 'descargaWorker.ts');

    for (let i = 0; i < config.MAX_CONCURRENT_WORKERS; i++) {
      // Le decimos a Node que use ts-node para poder leer el archivo .ts
      const worker = new Worker(workerPath, {
        execArgv: ['--require', 'ts-node/register'] 
      });

      worker.on('message', (respuesta: RespuestaWorker) => {
        logger.debug(`Worker ${i} completed task ${respuesta.id}`);
        
        // 1. Resolvemos la promesa para avisarle al Service que terminó
        const tarea = this.tareasActivas.get(respuesta.id);
        if (tarea) {
          tarea.resolver(respuesta);
          this.tareasActivas.delete(respuesta.id);
        }

        // 2. Liberamos al trabajador y revisamos si hay fila esperando
        this.tareasEnProgreso.set(i, false);
        this.procesarCola();
      });

      worker.on('error', (error) => {
        logger.error(`Worker ${i} error`, error);
        this.tareasEnProgreso.set(i, false);
        this.procesarCola();
      });

      this.workers.push(worker);
      this.tareasEnProgreso.set(i, false);
    }

    logger.info(`Worker pool of ${config.MAX_CONCURRENT_WORKERS} initialized`);
  }

  async enqueue(mensaje: MensajeWorker): Promise<RespuestaWorker> {
    return new Promise((resolver, rechazar) => {
      const tarea: Tarea = { mensaje, resolver, rechazar };
      this.cola.push(tarea); // Entra a la fila
      this.procesarCola();   // Avisamos que hay alguien en la fila
    });
  }

  private procesarCola(): void {
    if (this.cola.length === 0) return;

    // Buscamos qué trabajador está rascándose la barriga (desocupado)
    let workerLibreIndex = -1;
    for (let [index, ocupado] of this.tareasEnProgreso.entries()) {
      if (!ocupado) {
        workerLibreIndex = index;
        break;
      }
    }

    // Si encontramos un trabajador libre y hay tareas en la cola
    if (workerLibreIndex !== -1 && this.cola.length > 0) {
      const tarea = this.cola.shift()!; // Sacamos al primero de la fila
      
      this.tareasEnProgreso.set(workerLibreIndex, true); // Lo ponemos a trabajar
      this.tareasActivas.set(tarea.mensaje.id, tarea); // Guardamos la referencia
      
      // Le lanzamos la tarea al trabajador
      this.workers[workerLibreIndex].postMessage(tarea.mensaje);
      
      // Llamamos de nuevo por si hay otro trabajador libre para el siguiente de la fila
      this.procesarCola();
    }
  }

  destruir(): void {
    this.workers.forEach((worker) => worker.terminate());
    logger.info('WorkerPool destroyed');
  }
}