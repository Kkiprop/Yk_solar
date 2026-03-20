import mongoose from 'mongoose';

export const connectDatabase = async () => {
  const mongoUri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME || 'yksolarworks';

  if (!mongoUri) {
    throw new Error('MONGODB_URI is not defined. Add it to server/.env.');
  }

  await mongoose.connect(mongoUri, { dbName });
  console.log('MongoDB connected');
};
