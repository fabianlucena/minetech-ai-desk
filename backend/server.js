import express from 'express';
import http from 'http';
import cors from 'cors';
import config from './config.js';
import logger from './logger.js';
import errorMiddleware from './middlewares/error.middleware.js';
import logMiddleware from './middlewares/log.middleware.js';
import checkAuthorizationTokenMiddleware from './middlewares/check_authorization_token_middleware.js';

await import('./models/index.js');
await import('./services/index.js');
await import('./controllers/index.js');
const routes = (await import('./routes/index.js')).default;

try {
  const app = express();
  const server = http.createServer(app);

  if (config.cors) {
    const corsOptions = config.cors === true ? {} : config.cors;
    app.use(cors(corsOptions));
    logger.info('🔓 CORS enabled ✔️');
  }
  app.use(express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }));
  app.use(checkAuthorizationTokenMiddleware);
  app.use(logMiddleware);
  app.use('/api', routes);
  app.use(errorMiddleware);

  await (await import('./web-sockets/index.js')).default(server);

  server.listen(config.port, () => logger.info(`📡 Server listening on port: ${config.port} ✔️`));
} catch (error) {
  logger.error('❌ Error setting up server:', error);
  process.exit(1);
}
