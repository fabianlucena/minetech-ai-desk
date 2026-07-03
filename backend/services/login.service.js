import { getDependency } from '../dependency.js';
import argon2 from 'argon2';
import { Error400 } from '../errors/error400.js';
import { Error403 } from '../errors/error403.js';
import { SessionResponse } from '../dto/session.dto.js';

export default class LoginService {
  constructor() {
    this.userService = getDependency('userService');
    this.userPasswordService = getDependency('userPasswordService');
    this.deviceService = getDependency('deviceService');
    this.sessionService = getDependency('sessionService');
  }

  async hashPassword(password) {
    const hash = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 3,
      parallelism: 1
    });

    return hash;
  }

  async login(data) {
    if (!data.username)
      throw new Error400('El nombre de usuario es obligatorio');

    if (!data.password)
      throw new Error400('La contraseña es obligatoria');

    const user = await this.userService.getByUsername(data.username);
    if (!user || !user.isActive|| !user.canLogin)
      throw new Error403('Usuario o contraseña incorrecta');

    const userPassword = await this.userPasswordService.getByUserId(user.id);
    if (!userPassword)
      throw new Error403('Usuario o contraseña incorrecta');

    const isValid = await argon2.verify(userPassword.passwordHash, data.password);
    if (!isValid)
      throw new Error403('Usuario o contraseña incorrectos');

    const device = await this.deviceService.getOrCreateByToken(data.deviceToken);

    let session = await this.sessionService.create({
      userId: user.id,
      deviceId: device.id,
    });

    session = await this.sessionService.decorateWithCredentials(session);
    const response = new SessionResponse(session);

    return response;
  }

  async autoLogin(data) {
    if (!data.autoLoginToken)
      throw new Error400('El token de inicio de sesión automático (autoLoginToken) es obligatorio');

    if (!data.deviceToken)
      throw new Error400('El token de dispositivo (deviceToken) es obligatorio');

    const device = await this.deviceService.getByToken(data.deviceToken);
    if (!device)
      throw new Error400('Dispositivo desconocido o token inválido');

    const previousSession = await this.sessionService.getByAutoLoginToken(data.autoLoginToken);
    if (!previousSession || previousSession.deviceId !== device.id || previousSession.closedAt)
      throw new Error400('Dispositivo desconocido o token inválido');

    let session = await this.sessionService.create({
      userId: previousSession.userId,
      deviceId: previousSession.deviceId,
    });

    session = await this.sessionService.decorateWithCredentials(session);
    const response = new SessionResponse(session);

    return response;
  }
}