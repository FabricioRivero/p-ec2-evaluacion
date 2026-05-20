import { Descarga } from '../domain/Descarga';
import { v4 as uuidv4 } from 'uuid';
import { WorkerPool } from '../shared/utils/workerPool';

export class DescargaService {
    private descargas: Map<string, Descarga> = new Map();
    // Contratamos la piscina de trabajadores
    private pool: WorkerPool = new WorkerPool();

    iniciarDescarga(url: string, tipo: string = 'mock'): Descarga {
        const id = uuidv4();
        const nuevaDescarga = new Descarga(id, url);
        this.descargas.set(id, nuevaDescarga);

        // Enviamos la tarea a la piscina
        this.pool.enqueue({
            id: id,
            url: url,
            tipo: tipo as any,
            maxReintentos: 3
        }).then((respuesta) => {
            // Cuando la piscina termina el trabajo (después de los 3 segundos simulados)
            const descargaActual = this.descargas.get(respuesta.id);
            if (descargaActual) {
                if (respuesta.success) {
                    descargaActual.actualizarProgreso(100);
                    console.log(`[Service] Descarga completada con éxito: ${respuesta.id}`);
                } else {
                    descargaActual.marcarComoError();
                    console.error(`[Service] Error en la descarga: ${respuesta.error}`);
                }
            }
        }).catch(error => {
            console.error(`[Service] Error al intentar encolar:`, error);
        });

        return nuevaDescarga;
    }

    obtenerTodas(): Descarga[] {
        return Array.from(this.descargas.values());
    }

    obtenerPorId(id: string): Descarga | undefined {
        return this.descargas.get(id);
    }
}