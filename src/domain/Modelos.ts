// 1. Jerarquía de Errores (Herencia básica)
export class DescargaError extends Error {
    constructor(mensaje: string) {
        super(mensaje);
        this.name = 'DescargaError';
    }
}

export class UrlInvalidaError extends DescargaError {
    constructor() {
        super('La URL debe empezar con http:// o ftp://');
        this.name = 'UrlInvalidaError';
    }
}

// 2. Value Object (Valida la regla de negocio)
export class UrlDescarga {
    public readonly valor: string;

    constructor(url: string) {
        // Validación nivel estudiante de 3er semestre
        if (!url.startsWith('http') && !url.startsWith('ftp') && !url.startsWith('mock')) {
            throw new UrlInvalidaError();
        }
        this.valor = url;
    }
}