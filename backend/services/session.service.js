import { getDependency } from '../dependency.js';
import { generateToken } from '../utils/token.js';

export default class SessionService {
  constructor() {
    this.sessionModel = getDependency('sessionModel');
    this.userService = getDependency('userService');
    this.config = getDependency('config');
  }

  async create(data) {
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

    const session = await this.sessionModel.create(data);
    return session;
  }
}