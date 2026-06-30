import { getDependency } from '../dependency.js';
import { Op } from 'sequelize';

export default class RoleIncludeService {
  constructor() {
    this.roleXIncludeModel = getDependency('roleXIncludeModel');
  }

  async getAllIdsByIds(roleIds) {
    let newIds;
    const allIds = [...roleIds];
    do {
      newIds = await this.roleXIncludeModel.findAll({
        attributes: ['includeId'],
        where: {
          [Op.and]: [
            { roleId: { [Op.in]: allIds } },
            { includeId: { [Op.notIn]: allIds } }
          ]
        },
        raw: true
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