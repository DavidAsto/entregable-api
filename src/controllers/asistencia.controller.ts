import { AsistenciaService } from "../services/asistencia.service";
import { Request, Response } from "express";
import { Asistencia, Receso } from "../models/asistencia.model";



export class AsistenciaController {

    private asistenciaService: AsistenciaService;

    constructor() {
        this.asistenciaService = new AsistenciaService();


        
    }

    async getAsistencias(req: Request, res: Response): Promise<Response> {
        try {
            const asistencias = await this.asistenciaService.getAsistencias();
            return res.status(200).json({
                data: asistencias,
            });
        } catch (error) {
            return res.status(500).json({ error: 'Error al obtener las asistencias' });
        }
    }

    async getAsistenciaById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const asistencia = await this.asistenciaService.getAsistenciaById(Number(id));
            if (!asistencia) {
                return res.status(404).json({ error: 'Asistencia no encontrada' });
            }
            return res.status(200).json({
                data: asistencia,
            });
        } catch (error) {
            return res.status(500).json({ error: 'Error al obtener la asistencia' });
        }
    }

    async getAsistenciasByEmpleadoId(req: Request, res: Response): Promise<Response> {
        const { empleadoId } = req.params;
        try {
            const asistencias = await this.asistenciaService.getAsistenciasByEmpleadoId(Number(empleadoId));
            return res.status(200).json({
                data: asistencias,
            });
        } catch (error) {
            return res.status(500).json({ error: 'Error al obtener las asistencias del empleado' });
        }
    }

    async createIngreso(req: Request, res: Response): Promise<Response> {
        try {
            const { empleadoId, receso } = req.body;

            if (!empleadoId || isNaN(Number(empleadoId)) || receso === undefined) {
                return res.status(400).json({ error: 'Faltan datos requeridos o el formato es incorrecto' });
            }

            let valorReceso = Receso.NO; 
            if (receso !== Receso.SI && receso !== Receso.NO) {
                return res.status(400).json({ error: 'El valor de receso no es válido' });
            }

            try{
                const nuevoIngreso = await this.asistenciaService.createIngreso(empleadoId, valorReceso);
                return res.status(201).json({
                    data: nuevoIngreso,
                    message: 'Ingreso creado exitosamente',
                });
            } catch (error: any) {
                if (error.message === 'Ya existe un registro de ingreso abierto para este empleado.') {
                    return res.status(400).json({ error: error.message });
            }
            throw error; 
        }
        } catch (error: any) {
            return res.status(500).json({ error: 'Error al crear el ingreso' });
        }
    }

    async createSalida(req: Request, res: Response): Promise<Response> {
        try {
            const { empleadoId } = req.body;

            if (!empleadoId) {
                return res.status(400).json({ error: 'Faltan datos requeridos' });
            }

            const asistenciaActual = await this.asistenciaService.getAsistenciaActual(empleadoId);
            if (!asistenciaActual) {
                return res.status(400).json({ error: 'No existe un registro de ingreso abierto para este empleado.' });
            }

            const nuevoSalida = await this.asistenciaService.createSalida(empleadoId);

            if (!nuevoSalida) {
                return res.status(500).json({ error: 'No se pudo crear la salida' });
            }

            return res.status(201).json({
                data: nuevoSalida,
                message: 'Salida creada exitosamente',
            })

        } catch (error: any) {
            return res.status(500).json({ error: 'Error al crear la salida' });
        }
    }

    async getAsistenciaActual(req: Request, res: Response): Promise<Response> {
        try {
            const { empleadoId } = req.params;

            const asistenciaActual = await this.asistenciaService.getAsistenciaActual(Number(empleadoId));
            if (!asistenciaActual) {
                return res.status(404).json({ error: 'No existe un registro de ingreso abierto para este empleado.' });
            }

            const fechaIngreso = new Date(asistenciaActual.ingreso);
            const fechaActual = new Date();
            
            const horasTrabajadas = (fechaActual.getTime() - fechaIngreso.getTime()) / (1000 * 60 * 60); // Convertir a horas

            return res.status(200).json({
                data: {
                    ...asistenciaActual,
                    tiempoTranscurrido: horasTrabajadas.toFixed(2), 
                }
            });
        } catch (error) {
            return res.status(500).json({ error: 'Error al obtener la asistencia actual' });
        }
    }

}