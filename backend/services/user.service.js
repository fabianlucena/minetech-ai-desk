import { getDependency } from '../dependency.js';
import ModelService from './model.service.js';

export default class UserService extends ModelService {
  constructor() {
    super({ model: getDependency('userModel') });
  }

  getModelOptions(options) {
    options = super.getModelOptions(options);
    if (options.includeRoles || options.where?.roles || options.where?.role) {
      const where = { deletedAt: null };
      const roles = []
      if (options.where?.roles) {
        if (Array.isArray(options.where.roles)) {
          roles.push(...options.where.roles);
        } else {
          roles.push(options.where.roles);
        }

        delete options.where.roles;
      }
      if (options.where?.role) {
        if (Array.isArray(options.where.role)) {
          roles.push(...options.where.role);
        } else {
          roles.push(options.where.role);
        }

        delete options.where.role;
      }

      if (roles.length > 0)
        where.name = roles;

      options.include = options.include || [];
      options.include.push({
        model: getDependency('roleModel'),
        as: 'roles',
        where,
        through: {
          where: { deletedAt: null },
        },
      });
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

  get validPropertiesForCreation() {
    return ['username', 'displayName', 'isActive', 'canLogin', 'password', 'roles', 'lastLoginAt', 'email'];
  }

  async validateForCreation(data, options) {
    if (!data.username)
      throw new Error('El nombre de usuario es obligatorio');

    if (!data.displayName)
      throw new Error('El nombre para mostrar es obligatorio');

    const existing = await this.getByUsername(data.username, { includeDeleted: true });
    if (existing)
      throw new Error('El nombre de usuario ya está en uso');

    return await super.validateForCreation(data, options);
  }

  async create(data, options) {
    const user = await super.create(data, options);

    const globalOptions = { session: options?.session };

    if (data.password) {
      const userPasswordService = getDependency('userPasswordService');
      await userPasswordService.setPasswordById(user.id, data.password, globalOptions);
    }

    if (data.roles && Array.isArray(data.roles)) {
      const roleXUserService = getDependency('roleXUserService');
      await roleXUserService.updateRolesUuidById(user.id, data.roles, globalOptions);
    }

    return await this.getById(user.id);
  }

  get validPropertiesForUpdate() {
    return ['username', 'displayName', 'isActive', 'canLogin', 'password', 'roles', 'lastLoginAt'];
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
      await userPasswordService.setPasswordById(user.id, data.password, globalOptions);
    }

    if (data.roles && Array.isArray(data.roles)) {
      const roleXUserService = getDependency('roleXUserService');
      await roleXUserService.updateRolesUuidById(user.id, data.roles, globalOptions);
    }

    return result;
  }

  async updatePasswordByUuid(uuid, password, options) {
    if (!uuid)
      throw new Error('El UUID de usuario es obligatorio');

    if (!password)
      throw new Error('La contraseña es obligatoria');

    const user = await this.getByUuid(uuid);
    if (!user)
      throw new Error('Usuario no encontrado');

    const globalOptions = { session: options?.session };
    const userPasswordService = getDependency('userPasswordService');
    return await userPasswordService.setPasswordById(user.id, password, globalOptions);
  }

  async getIdByUsername(username, options) {
    if (!username)
      throw new Error('El nombre de usuario es obligatorio');

    if (Array.isArray(username)) {
      const rows = await this.getList({ ...options, attributes: ['id'], where: { ...options?.where, username } });
      return rows.map(r => r.id);
    } else {
      const row = await this.getFirstOrDefault({ ...options, attributes: ['id'], where: { ...options?.where, username } });
      return row?.id;
    }
  }

  async getIdByEmail(email, options) {
    if (!email)
      throw new Error('El correo electrónico es obligatorio');

    if (Array.isArray(email)) {
      const rows = await this.getList({ ...options, attributes: ['id'], where: { ...options?.where, email } });
      return rows.map(r => r.id);
    } else {
      const row = await this.getFirstOrDefault({ ...options, attributes: ['id'], where: { ...options?.where, email } });
      return row?.id;
    }
  }
}