import { getDependency } from '../dependency.js';

export default class RoleXUserService {
  constructor() {
    this.roleXUserModel = getDependency('roleXUserModel');
    this.roleService = getDependency('roleService');
  }

  async getRoleIdsByUserId(userId) {
    return await this.roleXUserModel.findAll({ attributes: ['roleId'], where: { userId } });
  }

  async getRolesByUserId(userId) {
    const rolesIds = await this.getRoleIdsByUserId(userId);
    return await this.roleService.getByIds(rolesIds.map(r => r.roleId));
  }
}