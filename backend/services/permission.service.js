import { getDependency } from '../dependency.js';

export default class PermissionService {
  constructor() {
    this.permissionModel = getDependency('permissionModel');
  }

  async getByIds(ids) {
    return await this.permissionModel.findAll({ where: { id: ids }, raw: true });
  }
}