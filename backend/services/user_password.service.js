import { getDependency } from '../dependency.js';

export default class UserPasswordService {
  constructor() {
    this.userPasswordModel = getDependency('userPasswordModel');
  }

  async findByUserId(userId) {
    const passwordHash = await this.userPasswordModel.findOne({ where: { userId } });
    return passwordHash;
  }
}