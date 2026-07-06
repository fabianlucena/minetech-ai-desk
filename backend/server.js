import config from './config.js';
import express from 'express';
import routes from './routes/index.js';
import './dependencies.js';
import sequelize from './database.js';
import errorMiddleware from './middlewares/error.middleware.js';
import logMiddleware from './middlewares/log.middleware.js';
import checkAuthorizationTokenMiddleware from './middlewares/check_authorization_token_middleware.js';
import logger from './logger.js';
import cors from 'cors';
import './models/index.js';

try {
  const app = express();

  if (config.cors) {
    const corsOptions = config.cors === true ? {} : config.cors;
    app.use(cors(config.cors));
    logger.info('🔓 CORS habilitado ✔️');
  }
  app.use(express.json());
  app.use(checkAuthorizationTokenMiddleware);
  app.use(logMiddleware);
  app.use('/api', routes);
  app.use(errorMiddleware);

  app.listen(config.port, () => logger.info(`📡 Server escuchando en el puerto: ${config.port} ✔️`));
} catch (error) {
  logger.error('❌ Error al inicializar el servidor:', error);
  process.exit(1);
}
