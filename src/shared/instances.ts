import { WorkerPool } from './utils/workerPool';

let workerPool: WorkerPool | null = null;

export function getWorkerPool(): WorkerPool {
  if (!workerPool) {
    workerPool = new WorkerPool();
  }
  return workerPool;
}

export function destruirWorkerPool(): void {
  workerPool?.destruir();
  workerPool = null;
}
