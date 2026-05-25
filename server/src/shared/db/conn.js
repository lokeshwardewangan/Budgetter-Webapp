import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { logger } from '../lib/logger.js';

mongoose.set('strictQuery', true);

const connectToDb = async () => {
  try {
    const instance = await mongoose.connect(env.MONGO_URL);
    logger.info({ host: instance.connection.host }, 'MongoDB connected');
  } catch (err) {
    logger.fatal({ err }, 'MongoDB connection failed');
    process.exit(1);
  }
};

export default connectToDb;
