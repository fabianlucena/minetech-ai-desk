import { getDependency } from '../dependency.js';
import ModelService from './model.service.js';

export default class UserPasswordService extends ModelService {
  constructor() {
    super({ model: getDependency('userPasswordModel') });
  }

  get validPropertiesForCreation() {
    return ['userId', 'passwordHash'];
  }

  async validateForCreation(data, options) {
    if (!data.userId)
      throw new Error('El ID de usuario es obligatorio');

    if (!data.passwordHash)
      throw new Error('El hash de la contraseña es obligatorio');

    const existing = await this.getByUserId(data.userId, { includeDeleted: true });
    if (existing)
      throw new Error('El usuario ya posee contraseña, debe modificarla');

    return await super.validateForCreation(data, options);
  }

  get validPropertiesForUpdate() {
    return ['userId', 'passwordHash'];
  }

  async validateForUpdate(data, options) {
    if (!data.passwordHash)
      throw new Error('El hash de la contraseña es obligatorio');

    const list = await this.getList({ where: options.where, includeDeleted: true });

    if (!list?.length)
      throw new Error('No se encontraron contraseñas para actualizar');

    if (list.length > 1)
      throw new Error('Se encontraron múltiples contraseñas para actualizar, debe especificar un usuario único');

    return await super.validateForUpdate(data, options);
  }

  async getByUserId(userId) {
    if (!userId)
      throw new Error('El ID de usuario es obligatorio');

    return await this.getFirstOrDefault({ where: { userId } });
  }

  async setPasswordHashForUser(userId, passwordHash) {
    if (!userId)
      throw new Error('El ID de usuario es obligatorio');

    if (!passwordHash)
      throw new Error('El hash de la contraseña es obligatorio');

    const existingPassword = await this.getByUserId(userId);
    if (existingPassword) {
      await this.updateByWhere({ passwordHash }, { userId });
    } else {
      await this.create({ userId, passwordHash });
    }
  }

  async setPasswordForUser(userId, password) {
    if (!userId)
      throw new Error('El ID de usuario es obligatorio');

    if (!password)
      throw new Error('La contraseña es obligatoria');

    this.passwordService = getDependency('passwordService');

    return await this.setPasswordHashForUser(userId, await this.passwordService.hashPassword(password));
  }
}