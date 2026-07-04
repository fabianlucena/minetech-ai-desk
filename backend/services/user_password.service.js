import { getDependency } from '../dependency.js';
import ModelService from './model.service.js';

export default class UserPasswordService extends ModelService {
  constructor() {
    super({ model: getDependency('userPasswordModel') });
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
      await this.updateById(existingPassword.id, { passwordHash });
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

    return await this.setPasswordHashForUser(userId, this.passwordService.hashPassword(password));
  }
}