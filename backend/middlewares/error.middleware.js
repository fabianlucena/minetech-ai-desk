import logger from '../logger.js';

export default async function errorMiddleware(err, req, res, next) {
  res.status(err.statusCode || 500);
  
  res.json({ error: err.message });
  logger.error(err, console.trace());
}