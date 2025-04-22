export enum Receso {
    SI = 'SI',
    NO = 'NO'
}


export interface Asistencia {
    id?: number;    
    empleado_id: number;
    ingreso: Date;
    salida: Date;
    receso: Receso;
    horas_trabajadas: number;
}