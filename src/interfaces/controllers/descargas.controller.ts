import { Request, Response, NextFunction } from 'express';
import { DescargaService } from '../../application/DescargaService';

// Iniciamos nuestro "gerente"
const descargaService = new DescargaService();

export const crearDescarga = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { url, tipo } = req.body;

    if (!url) {
      res.status(400).json({ error: 'La URL es requerida' });
      return;
    }

    // Le decimos al gerente que inicie el trabajo
    const nuevaDescarga = descargaService.iniciarDescarga(url);
    
    res.status(201).json(nuevaDescarga);
  } catch (error) {
    next(error);
  }
};

export const obtenerEstadoDescarga = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Buscamos una descarga específica por su ID
    const descarga = descargaService.obtenerPorId(id);

    if (!descarga) {
      res.status(404).json({ error: 'Descarga no encontrada' });
      return;
    }

    res.json(descarga);
  } catch (error) {
    next(error);
  }
};

export const listarDescargas = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Pedimos la lista completa
    const descargas = descargaService.obtenerTodas();
    
    res.json({
      descargas: descargas,
      total: descargas.length
    });
  } catch (error) {
    next(error);
  }
};

export const reintentarDescarga = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    res.status(501).json({
      id,
      estado: 'REINTENTANDO',
      mensaje: 'Funcionalidad en construcción'
    });
  } catch (error) {
    next(error);
  }
};