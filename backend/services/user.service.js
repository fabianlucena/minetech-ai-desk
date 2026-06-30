import { getDependency } from '../dependency.js';

export default class UserService {
  constructor() {
    this.userModel = getDependency('userModel');
  }

  async getList() {
    try {
      const users = await this.userModel.findAll();
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }
}