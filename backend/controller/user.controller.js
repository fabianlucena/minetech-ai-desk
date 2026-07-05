import getDependency from '../dependency.js';
import { UserDTO } from '../dto/user.dto.js';
import { RoleMinDTO } from '../dto/role.dto.js';

export async function getList(req, res) {
  const userService = getDependency('userService');
  const users = await userService.getList({
    includeRoles: true,
    includePassword: true,
    includeDeleted: !!req.query.includeDeleted,
    session: req.session,
  });
  res.json(users.map(u => new UserDTO(u)));
}

export async function getByUuid(req, res) {
  const userService = getDependency('userService');
  const user = await userService.getByUuid(req.params.uuid, {
    includeRoles: true,
    session: req.session,
  });
  res.json(new UserDTO(user));
}

export async function getAsignableRoles(req, res) {
  const roleService = getDependency('roleService');
  const roles = await roleService.getList({
    where: { isAsignable: true },
    session: req.session,
  });
  res.json(roles.map(r => new RoleMinDTO(r)));
}

export async function create(req, res) {
  const userService = getDependency('userService');
  const user = await userService.create(
    req.body,
    { session: req.session }
  );
  res.json(new UserDTO(user));
}

export async function updateByUuid(req, res) {
  const userService = getDependency('userService');
  const user = await userService.updateByUuid(
    req.params.uuid,
    req.body,
    { session: req.session }
  );
  res.json(new UserDTO(user));
}

export async function deleteByUuid(req, res) {
  const userService = getDependency('userService');
  await userService.deleteByUuid(
    req.params.uuid,
    { session: req.session }
  );
  res.status(204).end();
}