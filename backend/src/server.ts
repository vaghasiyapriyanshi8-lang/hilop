import { createServer } from 'http';
import { Server } from 'socket.io';
import { config } from './config';
import { app } from './app';
import { connectMongo } from './utils/mongo';
import { connectRedis } from './utils/redis';
import { createLogger } from './core/logger';
import { attachSocketHandlers } from './sockets/socket';

const logger = createLogger('server');

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: [config.frontendUrl, config.mobileAppUrl], methods: ['GET', 'POST'] },
});

attachSocketHandlers(io);

const start = async () => {
  await connectMongo(config.mongoUri);
  await connectRedis(config.redisUri);

  httpServer.listen(config.port, () => {
    logger.info(`Hilop backend running on port ${config.port}`);
  });
};

start().catch((error) => {
  logger.error('Server failed to start', { error });
  process.exit(1);
});
