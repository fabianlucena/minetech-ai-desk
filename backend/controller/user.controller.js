import getDependency from '../dependency.js';

export async function getAll(req, res) {
  const userService = getDependency('userService');
  const users = await userService.getList();
  res.json(users);
}