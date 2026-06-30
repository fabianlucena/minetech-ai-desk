import { getDependency } from '../dependency.js';
import { generateToken } from '../utils/token.js';

export default class DeviceService {
  constructor() {
    this.deviceModel = getDependency('deviceModel');
    this.userService = getDependency('userService');
    this.config = getDependency('config');
  }

  async create(data) {
    data.token ||= generateToken(this.config.tokenSize);
    data.createdById ||=await this.userService.getSystemUserId();

    const device = await this.deviceModel.create(data);
    return device;
  }

  async getByToken(token) {
    if (!token)
      return;

    return this.deviceModel.findOne({ where: { token } });
  }

  async getOrCreateByToken(token) {
    let device = await this.getByToken(token);
    if (!device)
      device = await this.create({ token });

    return device;
  }

  async getIdOrCreateByToken(token) {
    let device = await this.getOrCreateByToken(token);
    return device.id;
  }
}