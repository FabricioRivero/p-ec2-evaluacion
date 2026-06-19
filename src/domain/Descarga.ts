export class Descarga {
    id: string;
    url: string;
    tipo: string;
    estado: 'pending' | 'in_progress' | 'completed' | 'error' | 'cancelled';
    progreso: number;
    intentos: number;
    maxReintentos: number;
    fechaCreacion: string;
    error?: string;

    constructor(id: string, url: string, tipo: string = 'mock', maxReintentos: number = 3) {
        this.id = id;
        this.url = url;
        this.tipo = tipo;
        this.estado = 'pending';
        this.progreso = 0;
        this.intentos = 0;
        this.maxReintentos = maxReintentos;
        this.fechaCreacion = new Date().toISOString();
    }

    actualizarProgreso(nuevoProgreso: number) {
        this.progreso = nuevoProgreso;
        if (this.progreso >= 100) {
            this.estado = 'completed';
            this.progreso = 100;
        } else {
            this.estado = 'in_progress';
        }
    }

    marcarComoError(mensaje?: string) {
        this.estado = 'error';
        this.error = mensaje;
        this.intentos += 1;
    }

    reiniciar() {
        if (this.intentos >= this.maxReintentos) {
            throw new Error(`Máximo de reintentos (${this.maxReintentos}) alcanzado`);
        }
        this.estado = 'pending';
        this.progreso = 0;
        this.error = undefined;
    }

    cancelar() {
        if (this.estado === 'completed') {
            throw new Error('No se puede cancelar una descarga ya completada');
        }
        if (this.estado === 'cancelled') {
            throw new Error('La descarga ya ha sido cancelada');
        }
        this.estado = 'cancelled';
        this.error = 'Descarga cancelada por el usuario';
    }
}

export class DescargaError extends Error {
    constructor(mensaje: string) {
        super(mensaje);
        this.name = 'DescargaError';
    }
}

export class UrlInvalidaError extends DescargaError {
    constructor() {
        super('La URL debe empezar con http://, ftp:// o mock://');
        this.name = 'UrlInvalidaError';
    }
}

export class UrlDescarga {
    public readonly valor: string;

    constructor(url: string) {
        if (!url.startsWith('http') && !url.startsWith('ftp') && !url.startsWith('mock')) {
            throw new UrlInvalidaError();
        }
        this.valor = url;
    }
}