import { Empleado } from "../models/empleado.model";
import {pool} from "../config/database";
import { RowDataPacket, ResultSetHeader } from "mysql2";


export class EmpleadoService {
    async getEmpleados(): Promise<Empleado[]> {
        const [rows] = await pool.query('SELECT * FROM empleados');
        return rows as Empleado[];
    }
    
    async getEmpleadoById(id: number): Promise<Empleado | null> {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM empleados WHERE id = ?', [id]);
    
        if (rows.length === 0) {
            return null;
        }
    
        return rows[0] as Empleado;
    }
    
    async createEmpleado(empleado: Empleado): Promise<Empleado> {
        const { nombre, apellido, dni, telefono } = empleado;
    
        const [result] = await pool.query<ResultSetHeader>('INSERT INTO empleados (nombre, apellido, dni, telefono) values (?, ?, ?, ?)', [nombre, apellido, dni, telefono]);
        const id = result.insertId;
        return {
            id,
            nombre,
            apellido,
            dni,
            telefono
        };
    }
    
    async updateEmpleado(id: number, empleado: Partial<Empleado>): Promise<boolean | null> {
        const { nombre, apellido, dni, telefono } = empleado;
    
        const empleadoExistente = await this.getEmpleadoById(id);
        if (!empleadoExistente) {
            return null;
        }
    
        const [result] = await pool.query<ResultSetHeader>('UPDATE empleados SET nombre = ?, apellido = ?, dni = ?, telefono = ? WHERE id = ?', [nombre, apellido, dni, telefono, id]);
    
        
    
        return result.affectedRows > 0;
    }
    
    async deleteEmpleado(id: number): Promise<boolean | null> {
    
        const empleadoExistente = await this.getEmpleadoById(id);
        if (!empleadoExistente) {
            return null;
        }
    
    
        const [result] = await pool.query<ResultSetHeader>('DELETE FROM empleados WHERE id = ?', [id]);
    
    
    
        return result.affectedRows > 0;
    }
}


