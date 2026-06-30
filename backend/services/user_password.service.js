import { getDependency } from '../dependency.js';

export default class UserPasswordService {
  constructor() {
    this.userPasswordModel = getDependency('userPasswordModel');
  }

  async getByUserId(userId) {
    const passwordHash = await this.userPasswordModel.findOne({ where: { userId }, raw: true });
    return passwordHash;
  }
}