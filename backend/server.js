import config from './config.js';
import express from 'express';
import { Sequelize } from 'sequelize';
import routes from './routes/index.js';
import './dependencies.js';
import sequelize from './database.js';

try {
  await sequelize.authenticate();
  console.log('🔌 Conexión a la base OK ✔️');
} catch (error) {
  console.error('❌ Error de conexión:', error);
  process.exit(1);
}

try {
  const app = express();

  app.use(express.json());
  app.use('/api', routes);

  app.listen(config.port, () => {
    console.log(`📡 Server escuchando en el puerto: ${config.port} ✔️`);
  });
} catch (error) {
  console.error('❌ Error al inicializar el servidor:', error);
  process.exit(1);
}
