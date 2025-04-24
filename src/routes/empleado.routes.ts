
import { Router } from "express";
import { EmpleadoController } from "../controllers/empleado.controller";

const router = Router();
const empleadoController = new EmpleadoController();



router.get("/", empleadoController.getEmpleados.bind(empleadoController) as any);
router.get("/:id", empleadoController.getEmpleadoById.bind(empleadoController) as any);
router.post("/", empleadoController.createEmpleado.bind(empleadoController) as any);
router.put("/actualizar/:id", empleadoController.updateEmpleado.bind(empleadoController) as any);
router.delete("/eliminar/:id", empleadoController.deleteEmpleado.bind(empleadoController) as any);




export default router;
