export class Descarga {
    id: string;
    url: string;
    estado: 'PENDIENTE' | 'DESCARGANDO' | 'COMPLETADA' | 'ERROR';
    progreso: number;

    constructor(id: string, url: string) {
        this.id = id;
        this.url = url;
        this.estado = 'PENDIENTE';
        this.progreso = 0;
    }

    // Método para cambiar el estado cuando el Worker nos avise
    actualizarProgreso(nuevoProgreso: number) {
        this.progreso = nuevoProgreso;
        if (this.progreso >= 100) {
            this.estado = 'COMPLETADA';
            this.progreso = 100;
        } else {
            this.estado = 'DESCARGANDO';
        }
    }

    // Método por si la descarga falla
    marcarComoError() {
        this.estado = 'ERROR';
    }
}