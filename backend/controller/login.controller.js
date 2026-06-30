import getDependency from '../dependency.js';

export async function login(req, res) {
  const loginService = getDependency('loginService');
  const session = await loginService.login(req.body);
  res.json(session);
}