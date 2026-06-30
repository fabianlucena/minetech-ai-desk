import logger from '../logger.js';

export default async function errorMiddleware(err, req, res, next) {
  if (err.statusCode) {
    res.status(err.statusCode);
  }
  
  res.json({ error: err.message });
  logger.error(err, console.trace());
}