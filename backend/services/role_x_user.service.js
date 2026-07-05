import { getDependency } from '../dependency.js';
import ModelService from './model.service.js';

export default class RoleXUserService extends ModelService {
  constructor() {
    super({
      model: getDependency('roleXUserModel'),
      traceable: false,
    });
    this.roleService = getDependency('roleService');
    this.roleIncludeService = getDependency('roleIncludeService');
  }

  async getRoleIdsByUserId(userId) {
    if (!userId)
      throw new Error('El ID de usuario es obligatorio');

    return (await this.getList({ where: { userId }, attributes: ['roleId'] }))
      .map(r => r.roleId);
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
    rolesIds = await this.roleIncludeService.getAllIdsByIds(rolesIds);
    return await this.roleService.getByIds(rolesIds);
  }

  async updateRoleIdsByUserId(userId, roleIds) {
    if (!userId)
      throw new Error('El ID de usuario es obligatorio');

    if (!Array.isArray(roleIds))
      throw new Error('Los IDs de roles deben ser un arreglo');

    await this.updateByWhere(
      {
        deletedAt: null,
        deletedById: null,
      },
      {
        userId,
        roleId: roleIds,
      },
      {
        includeDeleted: true,
      }
    );

    const existingRoleIds = await this.getRoleIdsByUserId(userId);
    const deleteingRoleIds = existingRoleIds.filter(roleId => !roleIds.includes(roleId));
    const addingRoleIds = roleIds.filter(roleId => !existingRoleIds.includes(roleId));

    if (deleteingRoleIds.length > 0)
      await this.deleteByWhere({ userId, roleId: deleteingRoleIds });

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