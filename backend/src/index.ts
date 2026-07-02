import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { moviesRouter } from './routes/movies.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 3001);

app.use(cors());
app.use(express.json());

// El router de películas concentra la primera superficie pública del catálogo.
app.use('/movies', moviesRouter);

// Endpoint mínimo para comprobar que el backend responde antes de conectar el resto de capas.
app.get('/health', (_request, response) => {
  response.json({ status: 'ok' });
});

// El arranque queda centralizado aquí para facilitar el despliegue y las pruebas locales.
app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
