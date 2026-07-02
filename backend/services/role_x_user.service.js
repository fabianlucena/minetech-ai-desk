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

    return await this.getList({ userId }, { attributes: ['roleId'] });
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
}