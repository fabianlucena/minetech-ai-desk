import sequelize from '../database.js';

import UserModel from './user.model.js';
import UserPasswordModel from './user_password.model.js';
import DeviceModel from './device.model.js';
import SessionModel from './session.model.js';
import RoleModel from './role.model.js';
import RoleXUserModel from './role_x_user.js';
import RoleXIncludeModel from './roles_includes.model.js';

export const UserPassword = UserPasswordModel(sequelize);
export const User = UserModel(sequelize);
export const Device = DeviceModel(sequelize);
export const Session = SessionModel(sequelize);
export const Role = RoleModel(sequelize);
export const RoleXUser = RoleXUserModel(sequelize);
export const RoleXInclude = RoleXIncludeModel(sequelize);