import mongoose from 'mongoose';

import { ensureAdminUser } from './ensureAdminUser.js';

let connectionPromise;
let hasLoggedConnection = false;

export const connectDatabase = async () => {
  const mongoUri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME || 'yksolarworks';

  if (!mongoUri) {
    throw new Error('MONGODB_URI is not defined. Add it to server/.env.');
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(mongoUri, { dbName })
      .then(async (instance) => {
        await ensureAdminUser();

        if (!hasLoggedConnection) {
          console.log('MongoDB connected');
          hasLoggedConnection = true;
        }

        return instance.connection;
      })
      .catch((error) => {
        connectionPromise = null;
        throw error;
      });
  }

  return connectionPromise;
};
