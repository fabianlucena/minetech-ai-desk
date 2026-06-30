import { getDependency } from '../dependency.js';

export default class RoleXUserService {
  constructor() {
    this.roleXUserModel = getDependency('roleXUserModel');
    this.roleService = getDependency('roleService');
    this.roleIncludeService = getDependency('roleIncludeService');
  }

  async getRoleIdsByUserId(userId) {
    return await this.roleXUserModel.findAll({ attributes: ['roleId'], where: { userId }, raw: true });
  }

  async getRolesByUserId(userId) {
    const rolesIds = await this.getRoleIdsByUserId(userId);
    return await this.roleService.getByIds(rolesIds.map(r => r.roleId));
  }

  async getAllRolesByUserId(userId) {
    let rolesIds = await this.getRoleIdsByUserId(userId);
    rolesIds = await this.roleIncludeService.getAllIdsByIds(rolesIds.map(r => r.roleId));
    return await this.roleService.getByIds(rolesIds);
  }
}