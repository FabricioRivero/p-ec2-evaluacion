import { Request, Response, NextFunction } from 'express';
import { DescargaService } from '../../application/DescargaService';
import { UrlDescarga, UrlInvalidaError } from '../../domain/Descarga';

const descargaService = new DescargaService();

export const crearDescarga = async (
    req: Request, res: Response, next: NextFunction
): Promise<void> => {
    try {
        const { url, tipo = 'mock', maxReintentos = 3 } = req.body;

        if (!url) {
            res.status(400).json({ message: 'La URL es requerida' });
            return;
        }

        try {
            new UrlDescarga(url);
        } catch (e) {
            res.status(400).json({ message: 'URL inválida: debe empezar con http, ftp o mock' });
            return;
        }

        const descarga = descargaService.iniciarDescarga(url, tipo, Number(maxReintentos));
        res.status(201).json(descarga);
    } catch (error) {
        next(error);
    }
};

export const obtenerEstadoDescarga = async (
    req: Request, res: Response, next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const descarga = descargaService.obtenerPorId(id);

        if (!descarga) {
            res.status(404).json({ message: 'Descarga no encontrada' });
            return;
        }

        res.json(descarga);
    } catch (error) {
        next(error);
    }
};

export const listarDescargas = async (
    req: Request, res: Response, next: NextFunction
): Promise<void> => {
    try {
        const descargas = descargaService.obtenerTodas();
        res.json(descargas); // array directo, no objeto
    } catch (error) {
        next(error);
    }
};

export const reintentarDescarga = async (
    req: Request, res: Response, next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const descarga = descargaService.reintentarDescarga(id);
        res.json(descarga);
    } catch (error: any) {
        if (error.message === 'Descarga no encontrada') {
            res.status(404).json({ message: error.message });
        } else if (error.message.includes('reintentos')) {
            res.status(400).json({ message: error.message });
        } else {
            next(error);
        }
    }
};

export const cancelarDescarga = async (
    req: Request, res: Response, next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const descarga = descargaService.cancelarDescarga(id);
        res.json({ message: `Descarga ${id} cancelada exitosamente`, descarga });
    } catch (error: any) {
        if (error.message === 'Descarga no encontrada') {
            res.status(404).json({ message: error.message });
        } else if (error.message.includes('completada') || error.message.includes('cancelada')) {
            res.status(400).json({ message: error.message });
        } else {
            next(error);
        }
    }
};