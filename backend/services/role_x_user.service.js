import { getDependency } from '../dependency.js';
import ModelService from './model.service.js';

export default class RoleXUserService extends ModelService {
  constructor() {
    super({ model: getDependency('roleXUserModel') });
    this.roleService = getDependency('roleService');
    this.roleIncludeService = getDependency('roleIncludeService');
  }

  async getRoleIdsByUserId(userId) {
    if (!userId)
      throw new Error('El ID de usuario es obligatorio');

    return await this.getList({ where: { userId }, attributes: ['roleId'] });
  }

  async getRolesByUserId(userId) {
    if (!userId)
      throw new Error('El ID de usuario es obligatorio');

    const rolesIds = await this.getRoleIdsByUserId(userId);
    return await this.roleService.getByIds(rolesIds.map(r => r.roleId));
  }

  async getAllRolesByUserId(userId) {
    if (!userId)
      throw new Error('El ID de usuario es obligatorio');
    
    let rolesIds = await this.getRoleIdsByUserId(userId);
    rolesIds = await this.roleIncludeService.getAllIdsByIds(rolesIds.map(r => r.roleId));
    return await this.roleService.getByIds(rolesIds);
  }

  async updateRoleIdsByUserId(userId, roleIds) {
    if (!userId)
      throw new Error('El ID de usuario es obligatorio');

    if (!Array.isArray(roleIds))
      throw new Error('Los IDs de roles deben ser un arreglo');

    const existingRoleIds = await this.getRolesIdsByUserId(userId);

    await this.deleteByWhere({ userId, roleId: existingRoleIds.filter(roleId => !roleIds.includes(roleId)) });

    const roleXUserList = roleIds
      .filter(roleId => !existingRoleIds.includes(roleId))
      .map(roleId => ({ userId, roleId }));

    await this.bulkCreate(roleXUserList);
  }

  async updateRolesUuidById(userId, roleUuids) {
    if (!userId)
      throw new Error('El ID de usuario es obligatorio');

    if (!Array.isArray(roleUuids))
      throw new Error('Los UUIDs de roles deben ser un arreglo');

    const roleService = getDependency('roleService');
    const roleIds = await roleService.getIdByUuid(roleUuids);
    await this.updateRoleIdsByUserId(userId, roleIds);
  }
}