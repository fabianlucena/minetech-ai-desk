import { getDependency } from '../dependency.js';

export default class PermissionXRoleService {
  constructor() {
    this.permissionXRoleModel = getDependency('permissionXRoleModel');
    this.permissionService = getDependency('permissionService');
  }

  async getPermissionIdsByRoleId(roleId) {
    return (await this.permissionXRoleModel.findAll({
      attributes: ['permissionId'],
      where: { roleId },
      raw: true
    })).map(p => p.permissionId);
  }

  async getPermissionsByRoleId(roleId) {
    const permissionIds = await this.getPermissionIdsByRoleId(roleId);
    return await this.permissionService.getByIds(permissionIds);
  }
}