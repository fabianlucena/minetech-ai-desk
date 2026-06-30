import { getDependency } from '../dependency.js';

export default class UserService {
  constructor() {
    this.userModel = getDependency('userModel');
  }

  async findByUsername(username) {
    const user = await this.userModel.findOne({ where: { username } });
    return user;
  }

  async getList() {
    const users = await this.userModel.findAll();
    return users;
  }
}