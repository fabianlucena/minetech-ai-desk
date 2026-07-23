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
    this.deviceService = getDependency('deviceService');
    this.roleXUserService = getDependency('roleXUserService');
    this.permissionXRoleService = getDependency('permissionXRoleService');
    this.config = getDependency('config');
  }

  get validPropertiesForCreation() {
    return ['userId', 'deviceId', 'authorizationToken', 'autoLoginToken', 'expiresAt', 'lastUsedAt', 'dataJson'];
  }

  async validateForCreation(data, options) {
    if (!data.userId)
      throw new Error('El ID de usuario es obligatorio');

    if (!data.deviceId)
      throw new Error('El ID del dispositivo es obligatorio');

    data = { ...data };
    data.authorizationToken ||= generateToken(this.config.tokenSize);
    data.autoLoginToken ||= generateToken(this.config.tokenSize);
    data.expiresAt ||= new Date(Date.now() + this.config.sessionExpiration * 1000);
    data.lastUsedAt ||= new Date();

    const req = options?.req;
    if (req) {
      data.data = {
        ip: options.req.headers('X-Forwarded-For') || options.req.connection?.remoteAddress || options.req.socket?.remoteAddress || null,
        userAgent: options.req.headers('User-Agent'),
        service: 'oauth2',
        identityProvider: options.provider.name,
        ...data.data,
      };
    }

    if (data.data) {
      if (data.dataJson)
        data.data = { ...JSON.parse(data.dataJson), ...data.data };

      data.dataJson = JSON.stringify(data.data);
      delete data.data;
    }

    return await super.validateForCreation(data, options);
  }

  async create(data, options = {}) {
    const session = await super.create(data, options);
    await this.userService.updateLastLoginAtById(data.userId);
    return session;
  }

  async getByAuthorizationToken(authorizationToken) {
    if (!authorizationToken)
      throw new Error('El token de autorización es obligatorio');

    return await this.getFirstOrDefault({ where: { authorizationToken } });
  }

  async getByAutoLoginToken(autoLoginToken) {
    if (!autoLoginToken)
      throw new Error('El token de auto-login es obligatorio');

    return await this.getFirstOrDefault({ where: { autoLoginToken } });
  }

  async decorateWithCredentials(session) {
    if (!session)
      throw new Error('La sesión es obligatoria');

    session = {...session};

    const device = await this.deviceService.getById(session.deviceId);
    const user = await this.userService.getById(session.userId);
    const roles = await this.roleXUserService.getAllRolesByUserId(session.userId);
    const rolesId = roles.map(role => role.id);
    const permissions = await this.permissionXRoleService.getPermissionsByRoleId(rolesId);

    session.device = device;
    session.user = user;
    session.roles = roles;
    session.permissions = permissions;

    return session;
  }
}