import { createServer } from 'http';
import { Server } from 'socket.io';
import { config } from './config';
import { app } from './app';
import { connectMongo } from './utils/mongo';
import { connectRedis } from './utils/redis';
import { createLogger } from './core/logger';
import { attachSocketHandlers } from './sockets/socket';
import { createAdminUser } from './modules/auth/auth.service';

const logger = createLogger('server');

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: config.corsOrigins, methods: ['GET', 'POST'] },
});

attachSocketHandlers(io);

const start = async () => {
  await connectMongo(config.mongoUri);
  await connectRedis(config.redisUri);

  // Ensure the admin user is created on server startup
  createAdminUser().catch((error) => {
    console.error('Error creating admin user:', error);
  });

  httpServer.listen(config.port, () => {
    logger.info(`Hilop backend running on port ${config.port}`);
  });
};

start().catch((error) => {
  logger.error('Server failed to start', { error });
  process.exit(1);
});
