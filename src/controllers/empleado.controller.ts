import { Request, Response } from "express";
import { Empleado } from "../models/empleado.model";
import { EmpleadoService } from "../services/empleado.service";


export class EmpleadoController {

    private empleadoService: EmpleadoService;

    constructor() {
        this.empleadoService = new EmpleadoService();
    }

    public async getEmpleados(req: Request, res: Response): Promise<Response> {
        try {
            const empleados = await this.empleadoService.getEmpleados();
            return res.status(200).json({
                data: empleados,
            });
        } catch (error) {
            return res.status(500).json({ error: 'Error al obtener los empleados' });
        }
    }

    public async getEmpleadoById(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        try {
            const empleado = await this.empleadoService.getEmpleadoById(Number(id));
            if (!empleado) {
                return res.status(404).json({ error: 'Empleado no encontrado' });
            }
            return res.status(200).json({
                data: empleado,
            });
        } catch (error) {
            return res.status(500).json({ error: 'Error al obtener el empleado' });
        }
    }

    public async createEmpleado(req: Request, res: Response): Promise<Response> {
        const empleado: Empleado = req.body;
        try {

            if (!empleado.nombre || !empleado.apellido || !empleado.dni || !empleado.telefono) {
                return res.status(400).json({ error: 'Faltan datos requeridos' });
            }

            const nuevoEmpleado = await this.empleadoService.createEmpleado(empleado);
            return res.status(201).json(nuevoEmpleado);
        } catch (error) {
            return res.status(500).json({ error: 'Error al crear el empleado' });
        }
    }

    public async updateEmpleado(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const empleado: Partial<Empleado> = req.body;
        try {

            if (!empleado.nombre && !empleado.apellido && !empleado.dni && !empleado.telefono) {
                return res.status(400).json({ error: 'Faltan datos requeridos' });
            }

            const actualizar = await this.empleadoService.updateEmpleado(Number(id), empleado);

            if (!actualizar) {
                return res.status(500).json({ error: 'error al actualizar' });
            }
            
            const empleadoActualizado = await this.empleadoService.getEmpleadoById(Number(id));
            
            return res.status(200).json({
                data: empleadoActualizado,
            });

        } catch (error) {
            return res.status(500).json({ error: 'Error al actualizar el empleado' });
        }
    }

    async deleteEmpleado(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        try {

            const empleadoExistente = await this.empleadoService.getEmpleadoById(Number(id));
            if (!empleadoExistente) {
                return res.status(404).json({ error: 'Empleado no encontrado' });
            }

            const eliminar = await this.empleadoService.deleteEmpleado(Number(id));
            
            if (!eliminar) {
                return res.status(500).json({ error: 'error al eliminar el empleado' });
            }

            return res.status(200).json({ message: 'Empleado eliminado' });
        } catch (error) {
            return res.status(500).json({ error: 'Error al eliminar el empleado' });
        }
    }
}