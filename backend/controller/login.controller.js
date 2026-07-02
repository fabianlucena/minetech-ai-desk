import getDependency from '../dependency.js';

export async function login(req, res) {
  const loginService = getDependency('loginService');
  const session = await loginService.login(req.body);
  res.json(session);
}

export async function autoLogin(req, res) {
  const loginService = getDependency('loginService');
  const session = await loginService.autoLogin(req.body);
  res.json(session);
}