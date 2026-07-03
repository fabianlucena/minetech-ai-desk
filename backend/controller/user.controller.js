import getDependency from '../dependency.js';
import { UserDTO } from '../dto/user.dto.js';

export async function getList(req, res) {
  const userService = getDependency('userService');
  const users = await userService.getList({}, {
    include: 'roles',
  });
  res.json(users.map(u => new UserDTO(u)));
}