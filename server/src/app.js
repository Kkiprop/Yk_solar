import 'dotenv/config';
import cors from 'cors';
import express from 'express';

import postRoutes from './routes/postRoutes.js';

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || true,
    credentials: true,
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

export default app;