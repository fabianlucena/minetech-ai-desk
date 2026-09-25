import winston from 'winston';
import { addDependency } from './dependency.js';
import config from './config.js';

const logger = winston.createLogger({
  ...config.logger,
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss.SSS",
    }),
    winston.format.colorize({
      all: true,
    }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
  ],
});

addDependency('logger', logger);

export default logger;