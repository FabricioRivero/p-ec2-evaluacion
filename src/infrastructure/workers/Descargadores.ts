// 1. Clase Abstracta (El padre)
export abstract class DescargadorBase {
    // Todos los hijos están obligados a tener este método
    abstract descargar(url: string): Promise<Buffer>;
}

// 2. Clases Concretas (Los hijos)
export class HttpDescargador extends DescargadorBase {
    async descargar(url: string): Promise<Buffer> {
        console.log(`[HTTP] Conectando a ${url}...`);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simula 2 seg
        return Buffer.from('Datos HTTP descargados');
    }
}

export class FtpDescargador extends DescargadorBase {
    async descargar(url: string): Promise<Buffer> {
        console.log(`[FTP] Autenticando y descargando de ${url}...`);
        await new Promise(resolve => setTimeout(resolve, 3000)); // Simula 3 seg
        return Buffer.from('Datos FTP descargados');
    }
}

export class MockDescargador extends DescargadorBase {
    async descargar(url: string): Promise<Buffer> {
        console.log(`[MOCK] Simulando descarga de prueba de ${url}...`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simula 1 seg
        return Buffer.from('Datos MOCK generados');
    }
}

// 3. Patrón Factory (La Fábrica)
export class DescargadorFactory {
    static crear(tipo: string): DescargadorBase {
        // Según lo que pida Swagger, entregamos el objeto correcto (Polimorfismo)
        if (tipo === 'http') return new HttpDescargador();
        if (tipo === 'ftp') return new FtpDescargador();
        return new MockDescargador(); // Por defecto
    }
}