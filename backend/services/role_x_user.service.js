import { getDependency } from '../dependency.js';
import ModelService from './model.service.js';

export default class RoleXUserService extends ModelService {
  constructor() {
    super({ model: getDependency('roleXUserModel') });
    this.roleService = getDependency('roleService');
    this.roleIncludeService = getDependency('roleIncludeService');
  }

  get validPropertiesForCreation() {
    return ['userId', 'roleId'];
  }

  async validateForCreation(data, options) {
    if (!data.userId)
      throw new Error('El ID de usuario es obligatorio');

    if (!data.roleId)
      throw new Error('El ID de rol es obligatorio');

    const existing = await this.getFirstOrDefault({ where: { userId: data.userId, roleId: data.roleId }, includeDeleted: true });
    if (existing)
      throw new Error('El usuario ya tiene asignado este rol');

    return await super.validateForCreation(data, options);
  }

  async getRoleIdsByUserId(userId, options) {
    if (!userId)
      throw new Error('El ID de usuario es obligatorio');

    return (await this.getList({ ...options, where: { userId }, attributes: ['roleId'] }))
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

  async updateRoleIdsByUserId(userId, roleIds, options) {
    if (!userId)
      throw new Error('El ID de usuario es obligatorio');

    if (!Array.isArray(roleIds))
      throw new Error('Los IDs de roles deben ser un arreglo');

    const globalOptions = { session: options?.session };

    await this.restoreByWhere(
      {
        userId,
        roleId: roleIds,
      },
      {
        ...globalOptions,
        includeDeleted: true,
      }
    );

    const existingRoleIds = await this.getRoleIdsByUserId(userId, globalOptions,);
    const deleteingRoleIds = existingRoleIds.filter(roleId => !roleIds.includes(roleId));
    const addingRoleIds = roleIds.filter(roleId => !existingRoleIds.includes(roleId));

    if (deleteingRoleIds.length > 0)
      await this.deleteByWhere({ userId, roleId: deleteingRoleIds }, globalOptions);

    const roleXUserList = roleIds
      .filter(roleId => !existingRoleIds.includes(roleId))
      .map(roleId => ({ userId, roleId }));

    await this.bulkCreate(roleXUserList, globalOptions);
  }

  async updateRolesUuidById(userId, roleUuids, options) {
    if (!userId)
      throw new Error('El ID de usuario es obligatorio');

    if (!Array.isArray(roleUuids))
      throw new Error('Los UUIDs de roles deben ser un arreglo');

    const globalOptions = { session: options?.session };

    const roleService = getDependency('roleService');
    const roleIds = await roleService.getIdByUuid(roleUuids, globalOptions);
    await this.updateRoleIdsByUserId(userId, roleIds, globalOptions);
  }
}