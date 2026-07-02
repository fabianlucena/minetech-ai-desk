import { getDependency } from '../dependency.js';
import ModelService from './model.service.js';

export default class UserPasswordService extends ModelService {
  constructor() {
    super({ model: getDependency('userPasswordModel') });
  }

  async getByUserId(userId) {
    if (!userId)
      throw new Error('El ID de usuario es obligatorio');

    return await this.getFirstOrDefault({ userId });
  }
}