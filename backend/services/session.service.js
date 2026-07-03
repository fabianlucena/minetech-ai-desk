import { getDependency } from '../dependency.js';
import { generateToken } from '../utils/token.js';
import ModelService from './model.service.js';

export default class SessionService extends ModelService {
  constructor() {
    super({
      model: getDependency('sessionModel'),
      softDelete: false,
    });
    this.userService = getDependency('userService');
    this.config = getDependency('config');
  }

  async create(data, options = {}) {
    if (!data.userId)
      throw new Error('El ID de usuario es obligatorio');

    if (!data.deviceId)
      throw new Error('El ID del dispositivo es obligatorio');

    data.createdById ||= await this.userService.getSystemUserId();
    data.updatedById ||= await this.userService.getSystemUserId();
    data.authorizationToken ||= generateToken(this.config.tokenSize);
    data.autoLoginToken ||= generateToken(this.config.tokenSize);
    data.expiresAt ||= new Date(Date.now() + this.config.sessionExpiration * 1000);
    data.lastUsedAt ||= new Date();

    const session = await super.create(data, options);

    await this.userService.updateLastLoginAtById(data.userId);

    return session;
  }

  async getByAutoLoginToken(autoLoginToken) {
    if (!autoLoginToken)
      throw new Error('El token de auto-login es obligatorio');

    return await this.getFirstOrDefault({ where: { autoLoginToken } });
  }
}