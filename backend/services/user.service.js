import { getDependency } from '../dependency.js';
import ModelService from './model.service.js';

export default class UserService extends ModelService {
  constructor() {
    super({ model: getDependency('userModel') });
  }

  getModelOptions(options) {
    options = super.getModelOptions(options);
    if (options.includeRoles) {
      options.include = [{
        model: getDependency('roleModel'),
        as: 'roles',
        through: {
          where: { deletedAt: null },
        },
      }],

      delete options.includeRoles;
    }

    return options;
  }

  async getByUsername(username) {
    if (!username)
      throw new Error('El nombre de usuario es obligatorio');

    return await this.getFirstOrDefault({ where: { username } });
  }

  async updateLastLoginAtById(userId) {
    if (!userId)
      throw new Error('El ID de usuario es obligatorio');

    await this.updateById(userId, { lastLoginAt: new Date() });
  }

  async create(data) {
    if (!data.username)
      throw new Error('El nombre de usuario es obligatorio');

    if (!data.displayName)
      throw new Error('El nombre para mostrar es obligatorio');

    const user = await super.create(data);

    if (data.password) {
      const userPasswordService = getDependency('userPasswordService');
      await userPasswordService.setPasswordForUser(user.id, data.password);
    }

    if (data.roles && Array.isArray(data.roles)) {
      const roleXUserService = getDependency('roleXUserService');
      await roleXUserService.updateRolesUuidById(user.id, data.roles);
    }

    return await this.getById(user.id);
  }

  async updateByUuid(uuid, data) {
    if (!uuid)
      throw new Error('El UUID de usuario es obligatorio');

    const user = await this.getByUuid(uuid);
    if (!user)
      throw new Error('Usuario no encontrado');

    const result = await this.updateById(user.id, data);

    if (data.password) {
      const userPasswordService = getDependency('userPasswordService');
      await userPasswordService.setPasswordForUser(user.id, data.password);
    }

    if (data.roles && Array.isArray(data.roles)) {
      const roleXUserService = getDependency('roleXUserService');
      await roleXUserService.updateRolesUuidById(user.id, data.roles);
    }

    return result;
  }

  async deleteByUuid(uuid) {
    if (!uuid)
      throw new Error('El UUID de usuario es obligatorio');

    const user = await this.getByUuid(uuid);
    if (!user)
      throw new Error('Usuario no encontrado');

    return await this.update(user.id, { deletedAt: new Date() });
  }
}