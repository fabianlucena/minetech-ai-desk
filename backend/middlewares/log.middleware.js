import logger from '../logger.js';

export default async function logMiddleware(req, res, next) {
  logger.info(`${req.method} ${req.url} ${req.session ? `(user: ${req.session.username})` : '(no auth)'}`);
  next();
}