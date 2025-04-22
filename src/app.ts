import express, {Request, Response} from 'express';
import cors from 'cors';
import { testConnection } from './config/database';
import dotenv from 'dotenv';

import asistenciaRoutes from './routes/asistencia.routes';
import empleadosRoutes from './routes/empleado.routes';

const app = express();
const PORT = process.env.PORT || 3000;



// Middleware
app.use(cors());

app.use(express.json());

app.use(express.urlencoded({extended: true}));

dotenv.config();

testConnection();


app.use('/api/asistencia', asistenciaRoutes);
app.use('/api/empleados', empleadosRoutes);



app.get('/', (req: Request, res: Response) => {
  res.send('API is running...');
});



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
})

