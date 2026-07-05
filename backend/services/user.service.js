import { getDependency } from '../dependency.js';
import ModelService from './model.service.js';

export default class UserService extends ModelService {
  constructor() {
    super({ model: getDependency('userModel') });
  }

  getModelOptions(options) {
    options = super.getModelOptions(options);
    if (options.includeRoles) {
      options.include = options.include || [];
      options.include.push({
        model: getDependency('roleModel'),
        as: 'roles',
        through: {
          where: { deletedAt: null },
        },
      }),
      delete options.includeRoles;
    }

    if (options.includePassword) {
      options.include = options.include || [];
      options.include.push({
        model: getDependency('userPasswordModel'),
        as: 'password',
      });
      delete options.includePassword;
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

  async create(data, options) {
    if (!data.username)
      throw new Error('El nombre de usuario es obligatorio');

    if (!data.displayName)
      throw new Error('El nombre para mostrar es obligatorio');

    const user = await super.create(data, options);

    const globalOptions = { session: options?.session };

    if (data.password) {
      const userPasswordService = getDependency('userPasswordService');
      await userPasswordService.setPasswordForUser(user.id, data.password, globalOptions);
    }

    if (data.roles && Array.isArray(data.roles)) {
      const roleXUserService = getDependency('roleXUserService');
      await roleXUserService.updateRolesUuidById(user.id, data.roles, globalOptions);
    }

    return await this.getById(user.id);
  }

  async updateByUuid(uuid, data, options) {
    if (!uuid)
      throw new Error('El UUID de usuario es obligatorio');

    const user = await this.getByUuid(uuid);
    if (!user)
      throw new Error('Usuario no encontrado');

    const globalOptions = { session: options?.session };
    const result = await this.updateById(user.id, data, globalOptions);

    if (data.password) {
      const userPasswordService = getDependency('userPasswordService');
      await userPasswordService.setPasswordForUser(user.id, data.password, globalOptions);
    }

    if (data.roles && Array.isArray(data.roles)) {
      const roleXUserService = getDependency('roleXUserService');
      await roleXUserService.updateRolesUuidById(user.id, data.roles, globalOptions);
    }

    return result;
  }

  async deleteByUuid(uuid) {
    if (!uuid)
      throw new Error('El UUID de usuario es obligatorio');

    const user = await this.getByUuid(uuid);
    if (!user)
      throw new Error('Usuario no encontrado');

    return await this.update(user.id, {
      deletedAt: new Date(),
      deletedById: await this.getCurrentUserId(),
    });
  }
}