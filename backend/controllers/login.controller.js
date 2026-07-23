import getDependency from '../dependency.js';
import { SessionResponse } from '../dto/session.dto.js';

export async function login(req, res) {
  const loginService = getDependency('loginService');
  const session = await loginService.login(req.body);
  const response = new SessionResponse(session);
  res.json(response);
}

export async function autoLogin(req, res) {
  const loginService = getDependency('loginService');
  const session = await loginService.autoLogin(req.body);
  const response = new SessionResponse(session);
  res.json(response);
}