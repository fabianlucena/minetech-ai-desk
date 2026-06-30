import { getDependency } from '../dependency.js';
import argon2 from 'argon2';
import { Error400 } from '../errors/error400.js';
import { Error403 } from '../errors/error403.js';

export default class LoginService {
  constructor() {
    this.userService = new (getDependency('userService'))();
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

    const user = await this.userService.findByUsername(data.username);
    if (!user || !user.is_active|| !user.can_login)
      throw new Error403('Usuario o contraseña incorrecta');

    const isValid = await argon2.verify(user.password, data.password);
    if (!isValid)
      throw new Error403('Usuario o contraseña incorrectos');

    const session = await this.sessionService.createForUser(user);

    return {
      authorizationToken: session.authorizationToken,
      autoLoginToken: session.autoLoginToken,
      device: session.device,
      username: session.username,
      role: session.role,
    };
  }
}