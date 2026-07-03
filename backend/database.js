import { Sequelize } from 'sequelize';
import config from './config.js';

const sequelize = new Sequelize(
  config.dbName,
  config.dbUser,
  config.dbPass,
  {
    host: config.dbHost,
    port: config.dbPort,
    dialect: 'postgres',
    logging: false, //console.log,
  }
);

export default sequelize;