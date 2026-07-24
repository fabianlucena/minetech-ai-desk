import { getDependency } from '../dependency.js';
import ModelService from './model.service.js';

export default class PermissionXRoleService extends ModelService {
  constructor() {
    super({ model: getDependency('permissionXRoleModel') });
    this.permissionService = getDependency('permissionService');
  }

  async getPermissionIdsByRoleId(roleId) {
    if (!roleId)
      throw new Error('El ID de rol es obligatorio');

    return (await this.getList({
      where: { roleId },
      attributes: ['permissionId']
    })).map(p => p.permissionId);
  }

  async getPermissionsByRoleId(roleId) {
    if (!roleId)
      throw new Error('El ID de rol es obligatorio');

    const permissionIds = await this.getPermissionIdsByRoleId(roleId);
    return await this.permissionService.getById(permissionIds);
  }
}