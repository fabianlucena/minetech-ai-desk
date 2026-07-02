import { getDependency } from '../dependency.js';
import { generateToken } from '../utils/token.js';
import ModelService from './model.service.js';

export default class DeviceService extends ModelService {
  constructor() {
    super({
      model: getDependency('deviceModel'),
      softDelete: false,
    });
    this.userService = getDependency('userService');
    this.config = getDependency('config');
  }

  async create(data) {
    data.token ||= generateToken(this.config.tokenSize);
    data.createdById ||=await this.userService.getSystemUserId();

    const device = await this.model.create(data);
    return device;
  }

  async getByToken(token) {
    if (!token)
      throw new Error('El token de dispositivo es obligatorio');

    return this.getFirstOrDefault({ token });
  }

  async getOrCreateByToken(token) {
    if (!token)
      throw new Error('El token de dispositivo es obligatorio');

    let device = await this.getByToken(token);
    if (!device)
      device = await this.create({ token });

    return device;
  }

  async getIdOrCreateByToken(token) {
    if (!token)
      throw new Error('El token de dispositivo es obligatorio');

    let device = await this.getOrCreateByToken(token);
    return device.id;
  }
}