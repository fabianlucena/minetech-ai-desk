import config from './config.js';
import express from 'express';
import { Sequelize } from 'sequelize';
import api from './api/index.js';

try {
  const sequelize = new Sequelize(config.dbConnectionString);
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
  process.exit(1);
}

try {
  const app = express();

  app.use(express.json());
  app.use('/api', api);

  app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
  });
} catch (error) {
  console.error('Error initializing the application:', error);
  process.exit(1);
}
