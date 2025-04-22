import { Asistencia, Receso } from "../models/asistencia.model";
import { pool } from "../config/database";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { Empleado} from "../models/empleado.model";


export class AsistenciaService {
    async getAsistencias(): Promise<Asistencia[]> {
        const [rows] = await pool.query('SELECT * FROM asistencias');
        return rows as Asistencia[];
    }
    
    
    async getAsistenciaById(id: number): Promise<Asistencia | null> {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM asistencias WHERE id = ?', [id]);
    
        if (rows.length === 0) {
            return null;
        }
    
        return rows[0] as Asistencia;
        
    }
    
    async getAsistenciasByEmpleadoId(empleadoId: number): Promise<Asistencia[]> {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM asistencias WHERE empleado_id = ? order by ingreso ASC', [empleadoId]);
        
        return rows as Asistencia[];
    }
    
    async createIngreso(empleadoId: number, receso: Receso = Receso.NO): Promise<Asistencia> {
        const asistenciaAbierto = await this.getAsistenciaActual(empleadoId);
        if (asistenciaAbierto) {
            throw new Error('Ya existe un registro de ingreso abierto para este empleado.');
        }
        
        const fechaIngreso = new Date();
    
        const [result] = await pool.query<ResultSetHeader>('INSERT INTO asistencias (empleado_id, ingreso, receso) VALUES (?, ?, ?)', [empleadoId, fechaIngreso, receso]);
    
        const id = result.insertId;
        return {
            id,
            empleado_id: empleadoId,
            ingreso: fechaIngreso,
            salida: null as unknown as Date,
            receso: receso,
            horas_trabajadas: 0
        };
    }
    
    
    async createSalida(empleadoId: number): Promise<Asistencia | null> {
        const asistenciaAbierto = await this.getAsistenciaActual(empleadoId);
        if (!asistenciaAbierto) {
            throw new Error('No existe un registro de ingreso abierto para este empleado.');
        }
    
        const fechaSalida = new Date();
        const ingreso = new Date(asistenciaAbierto.ingreso);
    
        const horas_trabajadas = +(fechaSalida.getTime() - ingreso.getTime()) / (1000 * 60 * 60); // Convertir a horas
        
        const [result] = await pool.query<ResultSetHeader>('UPDATE asistencias SET salida = ?, horas_trabajadas = ? WHERE id = ?', [fechaSalida, horas_trabajadas, asistenciaAbierto.id]);
    
        if (result.affectedRows === 0) {
            return null;
        }
    
        return {
            ...asistenciaAbierto,
            salida: fechaSalida,
            horas_trabajadas: horas_trabajadas
        }
    
    }
    
    async getAsistenciaActual(empleadoId: number): Promise<Asistencia | null> {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM asistencias WHERE empleado_id = ? AND salida IS NULL', [empleadoId]);
        
        if (rows.length === 0) {
            return null;
        }
    
        return rows[0] as Asistencia;
    }
    
}

