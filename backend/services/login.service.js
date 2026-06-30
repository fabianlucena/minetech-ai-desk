import { getDependency } from '../dependency.js';
import argon2 from 'argon2';
import { Error400 } from '../errors/error400.js';
import { Error403 } from '../errors/error403.js';
import { UserMinDTO } from '../dtos/user.dto.js';
import { SessionResponse } from '../dtos/session.dto.js';
import { RoleMinDTO } from '../dtos/role.dto.js';

export default class LoginService {
  constructor() {
    this.userService = getDependency('userService');
    this.userPasswordService = getDependency('userPasswordService');
    this.deviceService = getDependency('deviceService');
    this.sessionService = getDependency('sessionService');
    this.roleXUserService = getDependency('roleXUserService');
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

    const device = await this.deviceService.getOrCreateByToken(data.device);

    const session = await this.sessionService.create({
      userId: user.id,
      deviceId: device.id,
    });

    const response = new SessionResponse(session);

    response.device = device.token;
    response.user = new UserMinDTO(user);
    response.role = (await this.roleXUserService.getRolesByUserId(user.id))
      .map(role => role.name);

    return response;
  }
}