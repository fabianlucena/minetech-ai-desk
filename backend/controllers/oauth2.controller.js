import getDependency from '../dependency.js';
import { SessionResponse } from '../dto/session.dto.js';

export async function callback(req, res) {
  const oauth2Service = getDependency('oauth2Service');
  const session = await oauth2Service.callback(req.params.provider, req.params.action, req.query, req);
  const response = new SessionResponse(session);
  res.json(response);
}