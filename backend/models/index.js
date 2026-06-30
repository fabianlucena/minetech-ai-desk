import sequelize from '../database.js';
import UserModel from './user.model.js';

export const User = UserModel(sequelize);