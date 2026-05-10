import mongoose from 'mongoose';
import { createLogger } from '../core/logger';

const logger = createLogger('mongo');

export const connectMongo = async (uri: string): Promise<void> => {
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, { autoIndex: true });
  logger.info('MongoDB connected');
};
