
import { Router } from "express";
import { EmpleadoController } from "../controllers/empleado.controller";

const router = Router();
const empleadoController = new EmpleadoController();



router.get("/", empleadoController.getEmpleados.bind(empleadoController) as any);
router.get("/:id", empleadoController.getEmpleadoById.bind(empleadoController) as any);
router.post("/", empleadoController.createEmpleado.bind(empleadoController) as any);
router.put("/actualizar/:id", empleadoController.updateEmpleado.bind(empleadoController) as any);
router.delete("/eliminar/:id", empleadoController.deleteEmpleado.bind(empleadoController) as any);

//USAR ESTE TIPO DE RUTAS EN CASO NO FUNCIONE LAS DE ARRIBA SIGUIENDO TAMBIEN LO PUESTO EN EL CONTROLLADOR

//router.get('/', empleadoController.getEmpleados);
//router.get('/:id', empleadoController.getEmpleadoById);


//router.post('/empleado', empleadoController.createEmpleado);
//router.put('/actualizar/:id', empleadoController.updateEmpleado);
//router.delete('/eliminar/:id', empleadoController.deleteEmpleado);


export default router;
