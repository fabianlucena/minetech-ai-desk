import { getDependency } from '../dependency.js';

export default class RoleService {
  constructor() {
    this.roleModel = getDependency('roleModel');
  }

  async getByIds(ids) {
    return await this.roleModel.findAll({ where: { id: ids }, raw: true });
  }
}