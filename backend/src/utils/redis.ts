import { createClient } from 'redis';
import { createLogger } from '../core/logger';

const logger = createLogger('redis');
let client: ReturnType<typeof createClient>;

export const connectRedis = async (uri: string): Promise<void> => {
  client = createClient({ url: uri });
  client.on('error', (error) => logger.error('Redis error', { error }));
  await client.connect();
  logger.info('Redis connected');
};

export const getRedisClient = () => {
  if (!client) throw new Error('Redis client not initialized');
  return client;
};
