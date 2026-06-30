import { addDependency } from './dependency.js';
import config from './config.js';

import * as helloController from './controller/hello.controller.js';
import * as userController from './controller/user.controller.js';
import * as loginController from './controller/login.controller.js';

import * as models from './models/index.js';

import UserService from './services/user.service.js';
import UserPasswordService from './services/user_password.service.js';
import LoginService from './services/login.service.js';
import DeviceService from './services/device.service.js';
import SessionService from './services/session.service.js';
import RoleService from './services/role.service.js';
import RoleXUserService from './services/role_x_user.service.js';
import RoleIncludeService from './services/role_include.service.js';
import PermissionService from './services/permission.service.js';
import PermissionXRoleService from './services/permission_x_role.service.js';

addDependency('config', config);

for (const [key, value] of Object.entries(models)) {
  addDependency(key[0].toLocaleLowerCase() + key.substring(1) + 'Model', () => value);
}

addDependency('helloController', () => helloController);
addDependency('userController', () => userController);
addDependency('loginController', () => loginController);

addDependency('userService', () => new UserService());
addDependency('userPasswordService', () => new UserPasswordService());
addDependency('loginService', () => new LoginService());
addDependency('deviceService', () => new DeviceService());
addDependency('sessionService', () => new SessionService());
addDependency('roleService', () => new RoleService());
addDependency('roleXUserService', () => new RoleXUserService());
addDependency('roleIncludeService', () => new RoleIncludeService());
addDependency('permissionService', () => new PermissionService());
addDependency('permissionXRoleService', () => new PermissionXRoleService());