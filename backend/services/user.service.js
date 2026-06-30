import { getDependency } from '../dependency.js';

export default class UserService {
  constructor() {
    this.userModel = getDependency('userModel');
  }

  async getSystemUserId() {
    const systemUser = await this.userModel.findOne({ where: { username: 'system' }, raw: true });
    if (!systemUser)
      throw new Error('System user not found');
    return systemUser.id;
  }

  async getByUsername(username) {
    const user = await this.userModel.findOne({ where: { username }, raw: true });
    return user;
  }

  async getList() {
    const users = await this.userModel.findAll({ raw: true });
    return users;
  }
}