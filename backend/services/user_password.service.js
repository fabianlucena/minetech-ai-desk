import { getDependency } from '../dependency.js';
import ModelService from './model.service.js';

export default class UserPasswordService extends ModelService {
  constructor() {
    super({
      allowIdForCreation: true,
      model: getDependency('userPasswordModel'),
    });
  }

  get validPropertiesForCreation() {
    return ['id', 'userId', 'passwordHash'];
  }

  async validateForCreation(data, options) {
    if (!data.id)
      throw new Error('El ID de usuario es obligatorio');

    if (!data.passwordHash)
      throw new Error('El hash de la contraseña es obligatorio');

    const existing = await this.getById(data.id, { includeDeleted: true });
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

  async setPasswordHashById(id, passwordHash) {
    if (!id)
      throw new Error('El ID de usuario es obligatorio');

    if (!passwordHash)
      throw new Error('El hash de la contraseña es obligatorio');

    const existingPassword = await this.getById(id);
    if (existingPassword) {
      await this.updateByWhere({ passwordHash }, { id });
    } else {
      await this.create({ id, passwordHash });
    }
  }

  async setPasswordById(id, password) {
    if (!id)
      throw new Error('El ID de usuario es obligatorio');

    if (!password)
      throw new Error('La contraseña es obligatoria');

    this.passwordService = getDependency('passwordService');

    return await this.setPasswordHashById(id, await this.passwordService.hashPassword(password));
  }
}