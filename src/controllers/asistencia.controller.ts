import { AsistenciaService } from "../services/asistencia.service";
import { Request, Response } from "express";
import { Asistencia, Receso } from "../models/asistencia.model";



export class AsistenciaController {

    private asistenciaService: AsistenciaService;

    constructor() {
        this.asistenciaService = new AsistenciaService();


        //BINDS PARA QUE LAS RUTAS FUNCIONEN, USAR EN CASO EL PRIMER METODO NO FUNCIONE
        //this.getAsistencias = this.getAsistencias.bind(this);
        //this.getAsistenciaById = this.getAsistenciaById.bind(this);
        //this.getAsistenciasByEmpleadoId = this.getAsistenciasByEmpleadoId.bind(this);
        //this.createIngreso = this.createIngreso.bind(this);
        //this.createSalida = this.createSalida.bind(this);
        //this.getAsistenciaActual = this.getAsistenciaActual.bind(this);
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

            if (!empleadoId || receso === undefined) {
                return res.status(400).json({ error: 'Faltan datos requeridos' });
            }

            let valorReceso = Receso.NO; // Cambia esto según tu lógica de negocio
            if (receso && (receso === Receso.SI || receso === Receso.NO)) {
                valorReceso = receso;
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
                    tiempoTranscurrido: horasTrabajadas.toFixed(2), // Redondear a 2 decimales
                }
            });
        } catch (error) {
            return res.status(500).json({ error: 'Error al obtener la asistencia actual' });
        }
    }

}