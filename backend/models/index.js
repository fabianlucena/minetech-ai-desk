import sequelize from '../database.js';
import UserModel from './user.model.js';
import UserPasswordModel from './user_password.model.js';

export const UserPassword = UserPasswordModel(sequelize);
export const User = UserModel(sequelize);