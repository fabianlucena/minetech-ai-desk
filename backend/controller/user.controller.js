import getDependency from '../dependency.js';

export function getAll(req, res) {
  const userService = getDependency('userService');
  userService.getList()
    .then(users => res.json(users));
}