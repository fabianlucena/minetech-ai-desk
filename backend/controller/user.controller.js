import getDependency from '../dependency.js';
import { UserDTO } from '../dto/user.dto.js';
import { RoleMinDTO } from '../dto/role.dto.js';

export async function getList(req, res) {
  const userService = getDependency('userService');
  const users = await userService.getList({
    include: 'roles',
  });
  res.json(users.map(u => new UserDTO(u)));
}

export async function getByUuid(req, res) {
  const userService = getDependency('userService');
  const user = await userService.getByUuid(req.params.uuid, {
    include: 'roles',
  });
  res.json(new UserDTO(user));
}

export async function getAsignableRoles(req, res) {
  const roleService = getDependency('roleService');
  const roles = await roleService.getList({
    where: { isAsignable: true },
  });
  res.json(roles.map(r => new RoleMinDTO(r)));
}