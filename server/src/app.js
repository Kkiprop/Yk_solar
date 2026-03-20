import cors from 'cors';
import express from 'express';

import { connectDatabase } from './config/db.js';
import postRoutes from './routes/postRoutes.js';

export const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
  })
);
app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.use('/api', postRoutes);

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({
    message: error.message || 'Internal server error',
  });
});

let initializationPromise;

export const initializeApp = async () => {
  if (!initializationPromise) {
    initializationPromise = connectDatabase().catch((error) => {
      initializationPromise = undefined;
      throw error;
    });
  }

  await initializationPromise;
  return app;
};

export default app;