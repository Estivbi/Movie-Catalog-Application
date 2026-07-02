import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { moviesRouter } from './routes/movies.js';
import { commentsRouter } from './routes/comments.js';
import { ratingsRouter } from './routes/ratings.js';
import { usersRouter } from './routes/users.js';
import { adminRouter } from './routes/admin.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 3001);

app.use(cors());
app.use(express.json());

// El router de películas concentra la primera superficie pública del catálogo.
app.use('/movies', moviesRouter);
app.use('/comments', commentsRouter);
app.use('/ratings', ratingsRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);

// Endpoint mínimo para comprobar que el backend responde antes de conectar el resto de capas.
app.get('/health', (_request, response) => {
  response.json({ status: 'ok' });
});

// El arranque queda centralizado aquí para facilitar el despliegue y las pruebas locales.
app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
