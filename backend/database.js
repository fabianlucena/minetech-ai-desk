import { Sequelize } from 'sequelize';
import config from './config.js';
import pg from 'pg';

const types = pg.types;

// OID 1114 = timestamp without time zone
types.setTypeParser(1114, (stringValue) => new Date(stringValue + 'Z'));

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