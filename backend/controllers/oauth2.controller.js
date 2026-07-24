import getDependency from '../dependency.js';
import { SessionResponse } from '../dto/session.dto.js';

export async function callback(req, res) {
  const oauth2Service = getDependency('oauth2Service');
  const session = await oauth2Service.callback({
    provider: req.params.provider,
    action: req.params.action,
    data: req.query,
    options: { req }
  });
  const response = new SessionResponse(session);
  res.json(response);
}