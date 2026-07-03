import { getDependency } from '../dependency.js';
import { SessionResponse } from '../dto/session.dto.js';

const cache = new Map();

export default async function checkAuthorizationTokenMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    let session = cache.get(authHeader);
    if (!session) {
      const schema = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];

      if (schema.toLowerCase() !== 'bearer')
        throw new Error('Invalid authorization schema');

      if (!token)
        throw new Error('Authorization token is missing');

      const sessionService = getDependency('sessionService');
      session = await sessionService.getByAuthorizationToken(token);
      if (!session)
        throw new Error('Invalid authorization token');

      session = await sessionService.decorateWithCredentials(session);
      session = new SessionResponse(session);
      cache.set(authHeader, session);
    }

    req.session = session;
  }

  next();
}