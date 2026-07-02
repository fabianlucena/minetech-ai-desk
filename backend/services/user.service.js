import { getDependency } from '../dependency.js';
import ModelService from './model.service.js';

export default class UserService extends ModelService {
  constructor() {
    super({ model: getDependency('userModel') });
  }

  async getSystemUserId() {
    const systemUser = await this.getFirstOrDefault({ username: 'system' });
    if (!systemUser)
      throw new Error('Usuario system no encontrado');

    return systemUser.id;
  }

  async getByUsername(username) {
    if (!username)
      throw new Error('El nombre de usuario es obligatorio');

    return await this.getFirstOrDefault({ username });
  }

  async getList() {
    return await this.getList();
  }
}