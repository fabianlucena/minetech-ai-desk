import { getDependency } from '../dependency.js';
import { Op } from 'sequelize';
import ModelService from './model.service.js';

export default class RoleIncludeService extends ModelService {
  constructor() {
    super({ model: getDependency('roleIncludesModel') });
  }

  async getAllIdsByIds(roleIds) {
    if (!roleIds || !Array.isArray(roleIds))
      throw new Error('Los IDs de roles son obligatorios y deben ser un array');
    
    let newIds;
    const allIds = [...roleIds];
    do {
      newIds = await this.getList({
        where: {
          [Op.and]: [
            { roleId: { [Op.in]: allIds } },
            { includeId: { [Op.notIn]: allIds } }
          ]
        },
        attributes: ['includeId']
      });

      newIds.forEach(id => {
        if (!allIds.includes(id.includeId)) {
          allIds.push(id.includeId);
        }
      });
    } while (newIds.length > 0);

    return allIds;
  }
}