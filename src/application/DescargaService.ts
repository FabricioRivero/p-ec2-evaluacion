import { Descarga } from '../domain/Descarga';
import { v4 as uuidv4 } from 'uuid';
import { WorkerPool } from '../shared/utils/workerPool';

export class DescargaService {
    private descargas: Map<string, Descarga> = new Map();
    private pool: WorkerPool = new WorkerPool();

    iniciarDescarga(url: string, tipo: string = 'mock', maxReintentos: number = 3): Descarga {
        const id = uuidv4();
        const nuevaDescarga = new Descarga(id, url, tipo, maxReintentos);
        this.descargas.set(id, nuevaDescarga);

        this.pool.enqueue({
            id,
            url,
            tipo: tipo as any,
            maxReintentos
        }).then((respuesta) => {
            const descarga = this.descargas.get(respuesta.id);
            if (descarga) {
                if (respuesta.success) {
                    descarga.actualizarProgreso(100);
                } else {
                    descarga.marcarComoError(respuesta.error);
                }
            }
        }).catch(error => {
            const descarga = this.descargas.get(id);
            if (descarga) descarga.marcarComoError(String(error));
        });

        return nuevaDescarga;
    }

    reintentarDescarga(id: string): Descarga {
        const descarga = this.descargas.get(id);
        if (!descarga) {
            throw new Error('Descarga no encontrada');
        }
        if (descarga.estado !== 'error') {
            throw new Error('Solo se pueden reintentar descargas en estado error');
        }

        descarga.reiniciar();

        this.pool.enqueue({
            id,
            url: descarga.url,
            tipo: descarga.tipo as any,
            maxReintentos: descarga.maxReintentos
        }).then((respuesta) => {
            const d = this.descargas.get(respuesta.id);
            if (d) {
                if (respuesta.success) {
                    d.actualizarProgreso(100);
                } else {
                    d.marcarComoError(respuesta.error);
                }
            }
        }).catch(error => {
            const d = this.descargas.get(id);
            if (d) d.marcarComoError(String(error));
        });

        return descarga;
    }

    obtenerTodas(): Descarga[] {
        return Array.from(this.descargas.values());
    }

    obtenerPorId(id: string): Descarga | undefined {
        return this.descargas.get(id);
    }
}