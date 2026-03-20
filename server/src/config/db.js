import mongoose from 'mongoose';

let connectionPromise;

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
      .then(() => {
        console.log('MongoDB connected');
        return mongoose.connection;
      })
      .catch((error) => {
        connectionPromise = undefined;
        throw error;
      });
  }

  return connectionPromise;
};
