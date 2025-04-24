import { Router } from "express";
import { AsistenciaController } from "../controllers/asistencia.controller";

const router = Router();
const asistenciaController = new AsistenciaController();


router.get("/", asistenciaController.getAsistencias.bind(asistenciaController) as any);
router.get("/:id", asistenciaController.getAsistenciaById.bind(asistenciaController) as any);
router.get("/empleadoAsistencia/:empleadoId", asistenciaController.getAsistenciasByEmpleadoId.bind(asistenciaController) as any);
router.get("/actual/:empleadoId", asistenciaController.getAsistenciaActual.bind(asistenciaController) as any);

router.post("/ingreso", asistenciaController.createIngreso.bind(asistenciaController) as any);
router.put("/salida", asistenciaController.createSalida.bind(asistenciaController) as any);








export default router;